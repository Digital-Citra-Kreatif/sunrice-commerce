<?php

declare(strict_types=1);

namespace Workbench\App\Commerce;

use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Contracts\TracksShipments;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;
use Sunrice\Commerce\Shipping\TrackingInfo;

/**
 * A courier extension for tests: live rates per started kilogram (REG,
 * and YES at twice the price), only within Indonesia; tracking numbers
 * ending in "-DLV" read as delivered, others as in transit.
 */
class FakeCourier implements ShippingMethodType, TracksShipments
{
    public static function key(): string
    {
        return 'fake_courier';
    }

    public function label(): string
    {
        return 'Fake courier';
    }

    public function settingsSchema(): array
    {
        return [['handle' => 'per_kg', 'type' => 'commerce_money', 'label' => 'Per kilogram', 'required' => true]];
    }

    public function settingsRules(): array
    {
        return [];
    }

    public function rates(ShippingRequest $request, ShippingMethod $method): array
    {
        if ($request->destination?->country() !== 'ID') {
            return [];
        }
        $kg = max(1, (int) ceil($request->package->weight() / 1000));
        $cost = $kg * (int) $method->setting('per_kg', 9000);

        return [
            ShippingRate::for($method, $cost, 'REG', 'Fake courier REG', '2–3 days'),
            ShippingRate::for($method, $cost * 2, 'YES', 'Fake courier YES', '1 day'),
        ];
    }

    public function track(Shipment $shipment): TrackingInfo
    {
        $delivered = str_ends_with((string) $shipment->tracking_number, '-DLV');

        return new TrackingInfo($delivered ? 'Delivered' : 'In transit', $delivered, [
            ['at' => now()->subDay()->toIso8601String(), 'status' => 'Picked up'],
            ...($delivered ? [['at' => now()->toIso8601String(), 'status' => 'Delivered']] : []),
        ]);
    }
}
