<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;

/** A deposit order's balance_due_at passed with the balance unpaid. Fired once per order by commerce:tick. */
class BalanceOverdue
{
    use Dispatchable;

    public function __construct(public Order $order) {}
}
