<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Contracts\AddsUniqueCode;
use Sunrice\Commerce\Payments\Contracts\PaymentMethod;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Payments\PaymentStart;
use Sunrice\Commerce\Payments\UniqueCodes;
use Sunrice\Commerce\Support\DomainException;

/**
 * The pay page's action: pay an unpaid order (again, or with another
 * available method). An open payment with a different method is
 * cancelled, the method's fee replaces the old one in the totals, and a
 * new payment is started.
 *
 * After a deposit, the balance is paid here too: a payment for what is
 * left, with the chosen method. The totals stay as they are (no fee or
 * unique code changes once part is paid), and the order keeps its status.
 */
class PayWithMethod
{
    public function __construct(protected PaymentManager $payments, protected Timeline $timeline) {}

    public function payable(Order $order): bool
    {
        return $this->firstPayment($order) || $this->balancePayment($order);
    }

    /** Nothing is paid yet. */
    protected function firstPayment(Order $order): bool
    {
        return ! $order->isQuote() && $order->total > 0 && $order->paid_total === 0
            && in_array($order->status, [OrderStatus::PENDING, OrderStatus::FAILED], true)
            && in_array($order->payment_status, [OrderStatus::UNPAID, OrderStatus::PAYMENT_FAILED], true);
    }

    /** A deposit is paid and the balance is due (while the order is open). */
    protected function balancePayment(Order $order): bool
    {
        return ! $order->isQuote() && $order->isPartiallyPaid() && $order->balanceDue() > 0
            && in_array($order->status, [OrderStatus::PENDING, OrderStatus::ON_HOLD, OrderStatus::PROCESSING], true);
    }

    /** @throws DomainException */
    public function handle(Order $order, string $key): PaymentStart
    {
        if (! $this->payable($order)) {
            throw new DomainException(__('commerce::payments.not_payable'));
        }
        $available = $this->payments->available(PaymentContext::fromOrder($order));
        $method = $available[$key] ?? null;
        if ($method === null) {
            throw new DomainException(__('commerce::checkout.errors.payment'));
        }

        $payment = $this->balancePayment($order) ? $this->balance($order, $key, $method) : DB::transaction(function () use ($order, $key, $method): Payment {
            $open = $order->payments()->whereIn('status', ['pending', 'failed'])->latest('id')->first();
            if ($open !== null && $open->method === $key && $open->status === 'pending') {
                return $open;
            }
            if ($open !== null) {
                app(RecordPaymentResult::class)->handle($open, PaymentResult::cancelled(), Actor::customer());
            }
            // The fee follows the method: the old method's fee comes out of the totals, the new one's goes in.
            $oldFee = (int) $order->adjustments()->where('source_type', 'payment_fee')->sum('amount');
            $order->adjustments()->where('source_type', 'payment_fee')->delete();
            $order->forceFill(['total' => $order->total - $oldFee, 'fee_total' => $order->fee_total - $oldFee]);
            $fee = $method->fee(PaymentContext::fromOrder($order));
            $newFee = $fee !== null ? max(0, $fee->amount) : 0;
            if ($fee !== null && $newFee > 0) {
                $order->adjustments()->create(['kind' => 'fee', 'source_type' => 'payment_fee', 'source_id' => $key, 'label' => $fee->label, 'amount' => $newFee, 'created_at' => now()]);
            }
            // So does the unique transfer code (kept when staying with the same method).
            $oldCode = (int) $order->adjustments()->where('source_type', 'unique_code')->sum('amount');
            $order->adjustments()->where('source_type', 'unique_code')->delete();
            $base = $order->total - $oldCode + $newFee;
            $code = $method instanceof AddsUniqueCode && ($range = $method->uniqueCodeRange()) !== null
                ? ($key === $order->payment_method && $oldCode !== 0 ? $oldCode : app(UniqueCodes::class)->pick($base, $range, $key)) : 0;
            if ($code !== 0) {
                $order->adjustments()->create(['kind' => 'unique_code', 'source_type' => 'unique_code', 'label' => __('commerce::payments.unique_code'),
                    'amount' => $code, 'created_at' => now()]);
            }
            $order->forceFill([
                'fee_total' => $order->fee_total + $newFee,
                'total' => $base + $code,
                'payment_method' => $key,
                'payment_method_title' => PaymentManager::titleOf($method),
                'version' => $order->version + 1,
            ]);
            $deadline = $method->deadline($order);
            $order->forceFill(['expires_at' => $deadline])->save();
            $this->timeline->record($order, 'payment', Timeline::text('commerce::payments.method_chosen', ['method' => $order->payment_method_title]), ['method' => $key], Actor::customer());

            return Payment::query()->create([
                'order_id' => $order->id, 'method' => $key, 'method_title' => $order->payment_method_title, 'amount' => $order->total,
                'currency' => $order->currency, 'status' => 'pending', 'expires_at' => $deadline,
            ]);
        });

        return app(StartPayment::class)->handle($order, $payment) ?? PaymentStart::instructions();
    }

    /** A payment for the balance; an open one with the same method is kept. */
    protected function balance(Order $order, string $key, PaymentMethod $method): Payment
    {
        return DB::transaction(function () use ($order, $key, $method): Payment {
            $open = $order->payments()->whereIn('status', ['pending', 'failed'])->latest('id')->first();
            if ($open !== null && $open->method === $key && $open->status === 'pending' && $open->amount === $order->balanceDue()) {
                return $open;
            }
            if ($open !== null) {
                app(RecordPaymentResult::class)->handle($open, PaymentResult::cancelled(), Actor::customer());
            }
            $title = PaymentManager::titleOf($method);
            $this->timeline->record($order, 'payment', Timeline::text('commerce::payments.method_chosen', ['method' => $title]), ['method' => $key, 'part' => 'balance'], Actor::customer());

            return Payment::query()->create([
                'order_id' => $order->id, 'method' => $key, 'method_title' => $title, 'amount' => $order->balanceDue(),
                'currency' => $order->currency, 'status' => 'pending', 'expires_at' => $method->deadline($order), 'meta' => ['part' => 'balance'],
            ]);
        });
    }

    /**
     * The methods offered on the pay page.
     *
     * @return array<int, array{key: string, title: string, description: string|null}>
     */
    public function options(Order $order): array
    {
        $out = [];
        // Offer methods by the amount before any payment fee.
        $fees = (int) $order->adjustments()->where('source_type', 'payment_fee')->sum('amount');
        $baseOrder = (clone $order)->forceFill(['total' => $order->total - $fees, 'fee_total' => $order->fee_total - $fees]);
        foreach ($this->payments->available(PaymentContext::fromOrder($baseOrder)) as $key => $method) {
            $out[] = ['key' => $key, 'title' => PaymentManager::titleOf($method), 'description' => $method instanceof PaymentMethodBase ? $method->description() : null];
        }

        return $out;
    }
}
