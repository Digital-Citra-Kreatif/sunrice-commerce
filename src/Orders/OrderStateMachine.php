<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderCompleted;
use Sunrice\Commerce\Orders\Events\OrderFailed;
use Sunrice\Commerce\Orders\Events\OrderOnHold;
use Sunrice\Commerce\Orders\Events\OrderStatusChanged;
use Sunrice\Commerce\Orders\Events\QuoteDeclined;
use Sunrice\Commerce\Orders\Events\QuoteExpired;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * The only writer of an order's status (SPEC § Orders, the transition
 * table). Each change is checked, written with its timestamp, a version
 * bump and a timeline line in one transaction; events are dispatched
 * after commit, and the effects (releasing stock, emails…) are their
 * listeners.
 */
class OrderStateMachine
{
    /** @var array<string, array<string, array<int, string>>> type => from => allowed targets */
    public const TRANSITIONS = [
        'order' => [
            OrderStatus::PENDING => [OrderStatus::PROCESSING, OrderStatus::CANCELLED, OrderStatus::FAILED, OrderStatus::ON_HOLD],
            OrderStatus::FAILED => [OrderStatus::PENDING, OrderStatus::PROCESSING, OrderStatus::CANCELLED],
            OrderStatus::PROCESSING => [OrderStatus::COMPLETED, OrderStatus::CANCELLED, OrderStatus::REFUNDED, OrderStatus::ON_HOLD],
            OrderStatus::ON_HOLD => [OrderStatus::PENDING, OrderStatus::PROCESSING],
            OrderStatus::COMPLETED => [OrderStatus::REFUNDED],
        ],
        'quote' => [
            OrderStatus::REQUESTED => [OrderStatus::QUOTED, OrderStatus::DECLINED, OrderStatus::CANCELLED],
            OrderStatus::QUOTED => [OrderStatus::ACCEPTED, OrderStatus::DECLINED, OrderStatus::EXPIRED, OrderStatus::CANCELLED],
        ],
    ];

    /** @var array<string, class-string> */
    protected const EVENTS = [
        OrderStatus::CANCELLED => OrderCancelled::class,
        OrderStatus::COMPLETED => OrderCompleted::class,
        OrderStatus::ON_HOLD => OrderOnHold::class,
        OrderStatus::FAILED => OrderFailed::class,
        OrderStatus::DECLINED => QuoteDeclined::class,
        OrderStatus::EXPIRED => QuoteExpired::class,
    ];

    public function __construct(protected Timeline $timeline) {}

    /** Why the order can't move to $to (null when it can). */
    public function refusal(Order $order, string $to): ?string
    {
        $from = $order->status;
        $allowed = self::TRANSITIONS[$order->type][$from] ?? [];
        $labels = ['from' => OrderStatus::label($from), 'to' => OrderStatus::label($to)];
        if (! in_array($to, $allowed, true)) {
            return __('commerce::orders.transition.not_allowed', $labels);
        }
        if ($from === OrderStatus::ON_HOLD && $to !== $order->meta('hold_from', OrderStatus::PROCESSING)) {
            return __('commerce::orders.transition.hold_back', ['status' => OrderStatus::label((string) $order->meta('hold_from', OrderStatus::PROCESSING))]);
        }
        if ($order->isQuote()) {
            return null;
        }

        return match ($to) {
            OrderStatus::CANCELLED => $order->paid_total > $order->refunded_total ? __('commerce::orders.transition.refund_first') : null,
            OrderStatus::COMPLETED => $order->isPaid() || $order->payment_method === 'cod' || $order->total === 0 ? null : __('commerce::orders.transition.unpaid'),
            OrderStatus::REFUNDED => $order->paid_total > 0 && $order->refunded_total >= $order->paid_total ? null : __('commerce::orders.transition.not_refunded'),
            default => null,
        };
    }

    public function can(Order $order, string $to): bool
    {
        return $this->refusal($order, $to) === null;
    }

    /**
     * Move the order to $to. The given model is refreshed with the result.
     *
     * @param  array<string, mixed>  $data  extra timeline data
     *
     * @throws InvalidTransition
     */
    public function transition(Order $order, string $to, ?Actor $actor = null, ?string $reason = null, array $data = []): Order
    {
        $actor ??= Actor::system();
        $from = null;
        $saved = DB::transaction(function () use ($order, $to, $actor, $reason, $data, &$from): Order {
            /** @var Order $locked */
            $locked = Order::withTrashed()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            $from = $locked->status;
            if (($refusal = $this->refusal($locked, $to)) !== null) {
                throw new InvalidTransition($from, $to, $refusal);
            }

            $locked->status = $to;
            $locked->version++;
            if ($to === OrderStatus::ON_HOLD) {
                $locked->setMeta('hold_from', $from);
            } elseif ($from === OrderStatus::ON_HOLD) {
                $meta = (array) $locked->meta;
                unset($meta['hold_from']);
                $locked->meta = $meta;
            }
            match ($to) {
                OrderStatus::COMPLETED => $locked->completed_at = now(),
                OrderStatus::CANCELLED, OrderStatus::DECLINED, OrderStatus::EXPIRED => [$locked->cancelled_at, $locked->cancel_reason] = [now(), $reason],
                default => null,
            };
            $locked->save();

            $this->timeline->record($locked, 'status', __('commerce::orders.timeline.status', [
                'from' => OrderStatus::label($from), 'to' => OrderStatus::label($to),
            ]).($reason ? ' — '.$reason : ''), ['from' => $from, 'to' => $to, 'reason' => $reason, ...$data], $actor);

            return $locked;
        });

        $order->setRawAttributes($saved->getAttributes(), true);
        app(ActivityRecorder::class)->record('updated', $order->displayNumber(), ['changes' => ['status'], 'note' => "{$from} → {$to}"], 'order');

        DB::afterCommit(function () use ($saved, $from, $to, $actor, $reason): void {
            OrderStatusChanged::dispatch($saved, (string) $from, $to, $actor);
            if (isset(self::EVENTS[$to])) {
                $event = self::EVENTS[$to];
                $event::dispatch($saved, $actor, $reason);
            }
        });

        return $order;
    }
}
