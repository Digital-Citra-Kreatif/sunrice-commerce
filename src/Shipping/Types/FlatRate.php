<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Types;

use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;

/** A price per order, plus an optional amount per item. */
class FlatRate implements ShippingMethodType
{
    public static function key(): string
    {
        return 'flat';
    }

    public function label(): string
    {
        return 'Flat rate';
    }

    public function settingsSchema(): array
    {
        return [
            ['handle' => 'cost', 'type' => 'commerce_money', 'label' => 'Per order', 'required' => true],
            ['handle' => 'per_item', 'type' => 'commerce_money', 'label' => 'Per item', 'instructions' => 'Added for each unit shipped.'],
        ];
    }

    public function settingsRules(): array
    {
        return [];
    }

    public function rates(ShippingRequest $request, ShippingMethod $method): array
    {
        $cost = (int) $method->setting('cost', 0) + (int) $method->setting('per_item', 0) * $request->package->quantity();

        return [ShippingRate::for($method, $cost)];
    }
}
