<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\Models\Refund;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Contracts\SupportsRefunds;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * Money returned to the customer (ARCHITECTURE.md §12.3): up to what was
 * paid and not yet refunded, with returned quantities and an optional
 * restock. Payment totals change through RecordPaymentResult; once the
 * refunds reach the amount paid the order becomes Refunded. A gateway
 * method that supports refunds is asked first when $viaGateway.
 */
class RecordRefund
{
    public function __construct(protected RecordPaymentResult $payments, protected OrderStateMachine $states, protected Timeline $timeline) {}

    /**
     * @param  array<int, array{order_item_id: int, quantity: int}>  $items
     *
     * @throws ValidationException
     */
    public function handle(Order $order, int $amount, array $items, ?string $reason, bool $restock, Actor $actor, bool $viaGateway = false): Refund
    {
        $refundable = $order->paid_total - $order->refunded_total;
        if ($amount <= 0 || $amount > $refundable) {
            throw ValidationException::withMessages(['amount' => 'The refund must be more than zero and at most '.app(MoneyFormatter::class)->format(max(0, $refundable)).'.']);
        }
        $lines = $order->items()->whereNull('parent_id')->get()->keyBy('id');
        $rows = [];
        foreach ($items as $row) {
            $qty = (int) $row['quantity'];
            if ($qty <= 0) {
                continue;
            }
            /** @var OrderItem|null $item */
            $item = $lines->get((int) $row['order_item_id']);
            if ($item === null || $qty > $item->quantity - $item->refunded_quantity) {
                throw ValidationException::withMessages(['items' => 'A quantity is more than was bought.']);
            }
            $rows[] = ['order_item_id' => $item->id, 'quantity' => $qty];
        }

        $reference = null;
        $method = 'manual';
        if ($viaGateway) {
            $payment = $order->payments()->whereIn('status', ['paid', 'partially_refunded'])->latest('id')->first();
            $gateway = $payment !== null ? app(PaymentManager::class)->get($payment->method) : null;
            if ($payment !== null && $gateway instanceof SupportsRefunds) {
                $result = $gateway->refund($payment, $amount, (string) $reason);
                if (! $result->ok) {
                    throw ValidationException::withMessages(['amount' => $result->error ?? 'The payment provider refused the refund.']);
                }
                [$reference, $method] = [$result->reference, 'gateway'];
            }
        }

        $refund = DB::transaction(function () use ($order, $amount, $rows, $reason, $restock, $actor, $reference, $method, $lines): Refund {
            $refund = Refund::query()->create([
                'order_id' => $order->id, 'amount' => $amount, 'reason' => $reason, 'items' => $rows ?: null, 'restock' => $restock,
                'method' => $method, 'reference' => $reference, 'status' => 'completed', 'created_by' => $actor->userId,
            ]);
            $restockLines = [];
            foreach ($rows as $row) {
                /** @var OrderItem $item */
                $item = $lines->get($row['order_item_id']);
                $item->increment('refunded_quantity', $row['quantity']);
                if ($restock && ($stock = $item->stockLines((int) $row['quantity'])) !== []) {
                    array_push($restockLines, ...$stock);
                    $item->forceFill(['meta' => [...(array) $item->meta, 'restocked' => (int) ($item->meta['restocked'] ?? 0) + $row['quantity']]])->save();
                }
            }
            if ($restockLines !== []) {
                app(Inventory::class)->release($restockLines, $order, 'refund');
            }

            // Spread the amount over the paid payments, newest first.
            $left = $amount;
            foreach ($order->payments()->whereIn('status', ['paid', 'partially_refunded'])->orderByDesc('id')->get() as $payment) {
                /** @var Payment $payment */
                $part = min($left, $payment->amount - $payment->refunded_amount);
                if ($part > 0) {
                    $this->payments->handle($payment, PaymentResult::refunded($part, $reference ?? 'refund:'.$refund->id), $actor);
                    $left -= $part;
                }
            }
            if ($left > 0) {
                // Paid without a payment row (zero-total orders never get here): count it on the order.
                $order->forceFill(['refunded_total' => $order->refunded_total + $left])->save();
            }

            $order->refresh();
            $this->timeline->record($order, 'refund', __('commerce::orders.timeline.refund', ['amount' => app(MoneyFormatter::class)->format($amount)]).($reason ? " — {$reason}" : ''),
                ['refund_id' => $refund->id, 'restock' => $restock], $actor);
            if ($order->refunded_total >= $order->paid_total && $this->states->can($order, OrderStatus::REFUNDED)) {
                $this->states->transition($order, OrderStatus::REFUNDED, $actor);
            }

            return $refund;
        });
        DB::afterCommit(fn () => OrderRefunded::dispatch($order->fresh() ?? $order, $refund));

        return $refund;
    }
}
