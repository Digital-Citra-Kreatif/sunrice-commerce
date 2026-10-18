<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\Shipment;

class ShipmentCreated
{
    use Dispatchable;

    public function __construct(public Order $order, public Shipment $shipment) {}
}
