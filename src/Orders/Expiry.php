<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Contracts\SupportsStatusCheck;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentResult;
use Throwable;

/**
 * commerce:tick: unpaid payments past their deadline expire (cancelling
 * the order and releasing its reservations), except while a payment
 * confirmation awaits review; gateways that can be asked are asked once
 * first. Quotes past their validity expire.
 */
class Expiry
{
    public function __invoke(): int
    {
        return $this->payments() + $this->quotes();
    }

    public function payments(): int
    {
        $count = 0;
        Payment::query()->whereIn('status', ['pending', 'failed'])->whereNotNull('expires_at')->where('expires_at', '<=', now())
            ->orderBy('id')->limit(200)->get()
            ->each(function (Payment $payment) use (&$count): void {
                $method = app(PaymentManager::class)->get($payment->method);
                if ($method instanceof SupportsStatusCheck && ! ($payment->meta['checked_before_expiry'] ?? false)) {
                    $payment->forceFill(['meta' => [...(array) $payment->meta, 'checked_before_expiry' => true]])->save();
                    try {
                        $result = $method->check($payment);
                        if ($result->status !== 'pending' && app(RecordPaymentResult::class)->handle($payment, $result, Actor::gateway($payment->method))) {
                            return;
                        }
                    } catch (Throwable $e) {
                        report($e);
                    }
                }
                if (app(RecordPaymentResult::class)->handle($payment, PaymentResult::expired(), Actor::system())) {
                    $count++;
                }
            });

        return $count;
    }

    public function quotes(): int
    {
        $count = 0;
        Order::query()->where('type', 'quote')->where('status', OrderStatus::QUOTED)->whereNotNull('quote_valid_until')->where('quote_valid_until', '<', now())
            ->limit(200)->get()
            ->each(function (Order $quote) use (&$count): void {
                app(OrderStateMachine::class)->transition($quote, OrderStatus::EXPIRED, Actor::system());
                $count++;
            });

        return $count;
    }
}
