<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Contracts;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Shipping\BookingResult;

/** A carrier type that can book a pickup and return the tracking number. */
interface BooksShipments
{
    public function book(Order $order, Shipment $shipment): BookingResult;
}
