<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;

/**
 * A payment was recorded paid for an order that was already cancelled
 * (a gateway confirming after the deadline): its reservations are gone,
 * so OrderPaid doesn't fire and staff decide to refund or reinstate.
 */
class PaymentAfterCancellation
{
    use Dispatchable;

    public function __construct(public Payment $payment, public PaymentResult $result, public Order $order) {}
}
