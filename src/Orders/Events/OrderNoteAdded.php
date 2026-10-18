<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderEvent;

/** A staff note; the "note to customer" email listens when it is customer-visible. */
class OrderNoteAdded
{
    use Dispatchable;

    public function __construct(public Order $order, public OrderEvent $note) {}
}
