<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Contracts;

use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Shipping\TrackingInfo;

/** A carrier type that can report where a parcel is. */
interface TracksShipments
{
    public function track(Shipment $shipment): TrackingInfo;
}
