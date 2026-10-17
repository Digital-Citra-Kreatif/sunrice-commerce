<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;

/** Staff send the customer the link to pay (manual orders, edits, accepted quotes). */
class PaymentLinkRequested
{
    use Dispatchable;

    public function __construct(public Order $order) {}
}
