<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;

/** Staff changed an unpaid order's lines; $notify: the customer asked to be told. */
class OrderEdited
{
    use Dispatchable;

    /** @param  array<int, string>  $changes */
    public function __construct(public Order $order, public array $changes, public bool $notify = false) {}
}
