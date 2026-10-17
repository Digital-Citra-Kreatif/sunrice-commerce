<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentMethodBase;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Payments\PaymentStart;
use Sunrice\Commerce\Support\DomainException;

/**
 * The pay page's action: pay an unpaid order (again, or with another
 * available method). An open payment with a different method is
 * cancelled, the method's fee replaces the old one in the totals, and a
 * new payment is started.
 */
class PayWithMethod
{
    public function __construct(protected PaymentManager $payments, protected Timeline $timeline) {}

    public function payable(Order $order): bool
    {
        return ! $order->isQuote() && $order->total > 0 && $order->paid_total === 0
            && in_array($order->status, [OrderStatus::PENDING, OrderStatus::FAILED], true)
            && in_array($order->payment_status, [OrderStatus::UNPAID, OrderStatus::PAYMENT_FAILED], true);
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

        $payment = DB::transaction(function () use ($order, $key, $method): Payment {
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
            $order->forceFill([
                'fee_total' => $order->fee_total + $newFee,
                'total' => $order->total + $newFee,
                'payment_method' => $key,
                'payment_method_title' => PaymentManager::titleOf($method),
                'version' => $order->version + 1,
            ]);
            $deadline = $method->deadline($order);
            $order->forceFill(['expires_at' => $deadline])->save();
            $this->timeline->record($order, 'payment', __('commerce::payments.method_chosen', ['method' => $order->payment_method_title]), ['method' => $key], Actor::customer());

            return Payment::query()->create([
                'order_id' => $order->id, 'method' => $key, 'method_title' => $order->payment_method_title, 'amount' => $order->total,
                'currency' => $order->currency, 'status' => 'pending', 'expires_at' => $deadline,
            ]);
        });

        return app(StartPayment::class)->handle($order, $payment) ?? PaymentStart::instructions();
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
