<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;

class QuoteAccepted
{
    use Dispatchable;

    public function __construct(public Order $order) {}
}
