<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Actions;

use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Payments\PaymentStart;
use Throwable;

/**
 * Hands a placed order to its payment method (outside the placing
 * transaction): instructions are snapshotted on the payment, a "paid"
 * start is recorded, a redirect is returned to the caller. A failing
 * gateway leaves the order Pending; the pay page offers another try.
 */
class StartPayment
{
    public function __construct(protected PaymentManager $payments) {}

    public function handle(Order $order, Payment $payment): ?PaymentStart
    {
        $method = $this->payments->get($payment->method);
        if ($method === null) {
            return null;
        }
        try {
            $start = $method->start($order, $payment);
        } catch (Throwable $e) {
            report($e);

            return null;
        }
        if ($start->kind === 'instructions' && $start->data !== []) {
            $payment->forceFill(['instructions' => $start->data])->save();
        }
        if ($start->kind === 'paid' && $start->result !== null) {
            app(RecordPaymentResult::class)->handle($payment, $start->result, Actor::gateway($payment->method));
        }

        return $start;
    }
}
