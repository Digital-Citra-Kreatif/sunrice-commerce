<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Loyalty\Loyalty;
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
 * paid and not yet refunded (beyond the money paid, the loyalty points the
 * order paid with go back onto the wallet), with returned quantities and an optional
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
        // The order is locked while what can be refunded is worked out and recorded: two refunds at once can't both take the same amount.
        $refund = DB::transaction(function () use ($order, $amount, $items, $reason, $restock, $actor, $viaGateway): Refund {
            /** @var Order $locked */
            $locked = Order::withTrashed()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            // Money paid first, then the points the order paid with (back onto the wallet).
            $money = max(0, $locked->paid_total - $locked->refunded_total);
            $refundable = $money + app(Loyalty::class)->refundable($locked);
            if ($amount <= 0 || $amount > $refundable) {
                throw ValidationException::withMessages(['amount' => 'The refund must be more than zero and at most '.app(MoneyFormatter::class)->format(max(0, $refundable)).'.']);
            }
            $toMoney = min($amount, $money);
            $lines = $locked->items()->whereNull('parent_id')->get()->keyBy('id');
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
            if ($viaGateway && $toMoney > 0) {
                $payment = $locked->payments()->whereIn('status', ['paid', 'partially_refunded'])->latest('id')->first();
                $gateway = $payment !== null ? app(PaymentManager::class)->get($payment->method) : null;
                if ($payment !== null && $gateway instanceof SupportsRefunds) {
                    // Only the money part goes to the provider; points go back onto the wallet.
                    $result = $gateway->refund($payment, $toMoney, (string) $reason);
                    if (! $result->ok) {
                        throw ValidationException::withMessages(['amount' => $result->error ?? 'The payment provider refused the refund.']);
                    }
                    [$reference, $method] = [$result->reference, 'gateway'];
                }
            }

            $refund = Refund::query()->create([
                'order_id' => $locked->id, 'amount' => $amount, 'reason' => $reason, 'items' => $rows ?: null, 'restock' => $restock,
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
                app(Inventory::class)->release($restockLines, $locked, 'refund');
            }

            if ($amount > $toMoney) {
                app(Loyalty::class)->refund($locked, $amount - $toMoney, $actor->userId);
            }
            // Spread the money part over the paid payments, newest first.
            $left = $toMoney;
            foreach ($locked->payments()->whereIn('status', ['paid', 'partially_refunded'])->orderByDesc('id')->get() as $payment) {
                /** @var Payment $payment */
                $part = min($left, $payment->amount - $payment->refunded_amount);
                if ($part > 0) {
                    $this->payments->handle($payment, PaymentResult::refunded($part, $reference ?? 'refund:'.$refund->id), $actor);
                    $left -= $part;
                }
            }
            if ($left > 0) {
                // Paid without a payment row (zero-total orders never get here): count it on the order.
                $locked->refresh();
                $locked->forceFill(['refunded_total' => $locked->refunded_total + $left])->save();
            }

            $locked->refresh();
            $this->timeline->record($locked, 'refund', __('commerce::orders.timeline.refund', ['amount' => app(MoneyFormatter::class)->format($amount)]).($reason ? " — {$reason}" : ''),
                ['refund_id' => $refund->id, 'restock' => $restock], $actor);
            if ($locked->refunded_total >= $locked->paid_total && app(Loyalty::class)->refundable($locked) === 0 && $this->states->can($locked, OrderStatus::REFUNDED)) {
                $this->states->transition($locked, OrderStatus::REFUNDED, $actor);
            }

            return $refund;
        });
        DB::afterCommit(fn () => OrderRefunded::dispatch($order->fresh() ?? $order, $refund));

        return $refund;
    }
}
