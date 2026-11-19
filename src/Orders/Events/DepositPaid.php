<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\Payment;

/** Part of an order was paid (its deposit) and the balance is still due. OrderPaid follows once the total is. */
class DepositPaid
{
    use Dispatchable;

    public function __construct(public Order $order, public Payment $payment) {}
}
