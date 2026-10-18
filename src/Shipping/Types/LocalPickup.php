<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Types;

use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;

/**
 * Pickup at one of the store's locations: one rate per location (the
 * rate meta carries it). Offered without an address, so checkout can skip it.
 */
class LocalPickup implements ShippingMethodType
{
    public static function key(): string
    {
        return 'pickup';
    }

    public function label(): string
    {
        return 'Local pickup';
    }

    public function settingsSchema(): array
    {
        return [
            ['handle' => 'cost', 'type' => 'commerce_money', 'label' => 'Cost', 'instructions' => 'Usually free.'],
            ['handle' => 'locations', 'type' => 'repeater', 'label' => 'Pickup locations', 'required' => true, 'config' => ['min' => 1, 'max' => 30, 'fields' => [
                ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true, 'translatable' => false, 'config' => ['max' => 120]],
                ['handle' => 'address', 'type' => 'textarea', 'label' => 'Address', 'required' => true, 'translatable' => false, 'config' => ['max' => 500]],
                ['handle' => 'instructions', 'type' => 'textarea', 'label' => 'Instructions', 'translatable' => false, 'config' => ['max' => 1000], 'instructions' => 'Opening hours, what to bring.'],
            ]]],
        ];
    }

    public function settingsRules(): array
    {
        return [];
    }

    public function rates(ShippingRequest $request, ShippingMethod $method): array
    {
        $rates = [];
        foreach (array_values((array) $method->setting('locations', [])) as $i => $location) {
            $name = (string) ($location['name'] ?? '');
            $rates[] = ShippingRate::for($method, (int) $method->setting('cost', 0), 'loc'.$i, $method->titleFor().($name !== '' ? ': '.$name : ''),
                meta: ['pickup' => true, 'location' => ['name' => $name, 'address' => $location['address'] ?? null, 'instructions' => $location['instructions'] ?? null]]);
        }

        return $rates;
    }
}
