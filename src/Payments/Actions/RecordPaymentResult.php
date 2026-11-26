<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\DepositPaid;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Orders\TimelineText;
use Sunrice\Commerce\Payments\Events\PaymentAfterCancellation;
use Sunrice\Commerce\Payments\Events\PaymentExpired;
use Sunrice\Commerce\Payments\Events\PaymentFailed;
use Sunrice\Commerce\Payments\Events\PaymentRecorded;
use Sunrice\Commerce\Payments\Events\PaymentSucceeded;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * The one writer of payment state (ARCHITECTURE.md §13.2): payment rows,
 * the order's payment status, paid_total and refunded_total. Results that
 * don't move a payment forward are ignored, so webhooks, returns and
 * staff can report the same thing twice.
 *
 * An order paid in parts (a deposit, then the balance) is Partially paid
 * while something is paid and something is left: OrderPaid fires once,
 * when the total is paid; DepositPaid when the first part is.
 */
class RecordPaymentResult
{
    /** payment status => results that may follow it */
    protected const FORWARD = [
        'pending' => ['paid', 'awaiting_confirmation', 'failed', 'expired', 'cancelled'],
        'awaiting_confirmation' => ['paid', 'pending', 'failed', 'cancelled'],
        'failed' => ['paid', 'pending', 'awaiting_confirmation', 'expired', 'cancelled'],
        'expired' => ['paid'],
        // Cancelling here doesn't close the gateway's page: the customer can still pay there.
        'cancelled' => ['paid'],
        'paid' => ['refunded'],
        'partially_refunded' => ['refunded'],
        'refunded' => [],
    ];

    public function __construct(protected OrderStateMachine $states, protected Timeline $timeline) {}

    /** Whether the result changed anything. */
    public function handle(Payment $payment, PaymentResult $result, ?Actor $actor = null): bool
    {
        $actor ??= Actor::system();
        $changed = DB::transaction(function () use ($payment, $result, $actor): bool|string {
            /** @var Payment $locked */
            $locked = Payment::query()->whereKey($payment->id)->lockForUpdate()->firstOrFail();
            /** @var Order $order */
            $order = Order::withTrashed()->whereKey($locked->order_id)->lockForUpdate()->firstOrFail();

            if (! in_array($result->status, self::FORWARD[$locked->status] ?? [], true)) {
                return false;
            }
            if ($result->status === 'refunded' && ($result->amount ?? 0) <= 0) {
                return false;
            }
            // A gateway reporting less than was due doesn't settle the payment: staff can mark it paid.
            if ($result->status === 'paid' && $result->amount !== null && $result->amount < $locked->amount) {
                $money = app(MoneyFormatter::class);
                $this->timeline->record($order, 'note', Timeline::text('commerce::orders.timeline.underpaid', [
                    'method' => $locked->method_title ?? $locked->method, 'amount' => $money->format($result->amount), 'expected' => $money->format($locked->amount),
                ]), array_filter(['payment_id' => $locked->id, 'reference' => $result->reference, 'amount' => $result->amount]), $actor);

                return false;
            }
            $afterCancellation = $result->status === 'paid' && $order->status === OrderStatus::CANCELLED;
            // Paid on a payment set aside here (the customer chose another method, or the order was cancelled).
            $revived = $result->status === 'paid' && $locked->status === 'cancelled';

            $this->apply($locked, $order, $result);
            $this->partly($order, $result);
            $locked->save();
            $order->version++;
            $order->save();

            $money = app(MoneyFormatter::class);
            $this->timeline->record($order, 'payment', Timeline::text('commerce::orders.timeline.payment', [
                'status' => TimelineText::status($locked->status, 'payment'),
                'amount' => $money->format($result->status === 'refunded' ? (int) $result->amount : ($result->amount ?? $locked->amount)),
            ]), array_filter(['payment_id' => $locked->id, 'method' => $locked->method, 'status' => $result->status, 'reference' => $result->reference]), $actor);

            if ($revived && ! $afterCancellation) {
                // The order is still open: the money counts. What the newer payment was waiting for is no longer due.
                $this->timeline->record($order, 'note', Timeline::text('commerce::orders.timeline.paid_on_cancelled_payment', [
                    'method' => $locked->method_title ?? $locked->method, 'amount' => $money->format($result->amount ?? $locked->amount),
                ]), ['payment_id' => $locked->id], $actor);
                if ($order->paid_total >= $order->total) {
                    Payment::query()->where('order_id', $order->id)->whereKeyNot($locked->id)->whereIn('status', ['pending', 'failed'])
                        ->update(['status' => 'cancelled', 'updated_at' => now()]);
                }
            }
            if ($afterCancellation) {
                // Its stock, sale quantities and vouchers were released: nothing is fulfilled until staff decide.
                $this->timeline->record($order, 'note', Timeline::text('commerce::orders.timeline.paid_after_cancel', [
                    'amount' => $money->format($result->amount ?? $locked->amount),
                ]), ['payment_id' => $locked->id], $actor);
            }
            $this->moveOrder($order, $result->status, $actor);
            $payment->setRawAttributes($locked->getAttributes(), true);

            if ($afterCancellation) {
                return 'after_cancellation';
            }

            return $result->status === 'paid' && $order->payment_status === OrderStatus::PARTIALLY_PAID ? 'partly' : true;
        });

        if ($changed !== false) {
            DB::afterCommit(function () use ($payment, $result, $changed): void {
                $order = Order::withTrashed()->findOrFail($payment->order_id);
                PaymentRecorded::dispatch($payment, $result);
                match ($result->status) {
                    'paid' => match ($changed) {
                        'after_cancellation' => [PaymentSucceeded::dispatch($payment, $result), PaymentAfterCancellation::dispatch($payment, $result, $order)],
                        'partly' => [PaymentSucceeded::dispatch($payment, $result), DepositPaid::dispatch($order, $payment)],
                        default => [PaymentSucceeded::dispatch($payment, $result), OrderPaid::dispatch($order)],
                    },
                    'failed' => PaymentFailed::dispatch($payment, $result),
                    'expired' => PaymentExpired::dispatch($payment, $result),
                    default => null,
                };
            });
        }

        return $changed !== false;
    }

    protected function apply(Payment $payment, Order $order, PaymentResult $result): void
    {
        $at = $result->occurredAt !== null ? Carbon::instance($result->occurredAt) : now();
        switch ($result->status) {
            case 'paid':
                $amount = $result->amount ?? $payment->amount;
                $payment->status = 'paid';
                $payment->paid_at = $at;
                $payment->reference = $result->reference ?? $payment->reference;
                $order->paid_total += $amount;
                $order->paid_at ??= $at;
                $order->payment_status = OrderStatus::PAID;
                break;
            case 'refunded':
                $amount = min((int) $result->amount, $payment->amount - $payment->refunded_amount);
                $payment->refunded_amount += $amount;
                $payment->status = $payment->refunded_amount >= $payment->amount ? 'refunded' : 'partially_refunded';
                $order->refunded_total += $amount;
                $order->payment_status = $order->refunded_total >= $order->paid_total ? OrderStatus::PAYMENT_REFUNDED : OrderStatus::PARTIALLY_REFUNDED;
                break;
            case 'awaiting_confirmation':
                $payment->status = 'awaiting_confirmation';
                $order->payment_status = OrderStatus::AWAITING_CONFIRMATION;
                break;
            case 'pending':
                $payment->status = 'pending';
                $order->payment_status = OrderStatus::UNPAID;
                break;
            case 'failed':
                $payment->status = 'failed';
                $order->payment_status = OrderStatus::PAYMENT_FAILED;
                break;
            default: // expired, cancelled
                $payment->status = $result->status;
                $order->payment_status = OrderStatus::UNPAID;
        }
        if ($result->raw !== []) {
            $payment->meta = [...(array) $payment->meta, 'last_result' => $result->raw];
        }
    }

    /**
     * Between nothing paid and all paid, the order is Partially paid, whatever
     * the open payment for the balance is doing (pending, awaiting
     * confirmation, failed, expired). Refunds keep their own statuses.
     */
    protected function partly(Order $order, PaymentResult $result): void
    {
        if ($result->status === 'refunded' || $order->refunded_total > 0) {
            return;
        }
        if ($order->paid_total > 0 && $order->paid_total < $order->total) {
            $order->payment_status = OrderStatus::PARTIALLY_PAID;
            $order->paid_at = null; // set when the total is paid
        }
    }

    /** Paid → Processing; Failed → Failed; Expired → Cancelled (where the order can). */
    protected function moveOrder(Order $order, string $status, Actor $actor): void
    {
        $to = match ($status) {
            'paid' => in_array($order->status, [OrderStatus::PENDING, OrderStatus::FAILED], true) ? OrderStatus::PROCESSING : null,
            'failed' => $order->status === OrderStatus::PENDING ? OrderStatus::FAILED : null,
            'pending' => $order->status === OrderStatus::FAILED ? OrderStatus::PENDING : null,
            'expired' => in_array($order->status, [OrderStatus::PENDING, OrderStatus::FAILED], true) ? OrderStatus::CANCELLED : null,
            default => null,
        };
        if ($to !== null && $this->states->can($order, $to)) {
            $this->states->transition($order, $to, $actor, $status === 'expired' ? __('commerce::orders.timeline.expired') : null);
        }
    }
}
