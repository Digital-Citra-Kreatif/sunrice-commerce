<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Types;

use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;

/** Free: always, from a minimum subtotal (after discounts), or with a free-shipping voucher. */
class FreeShipping implements ShippingMethodType
{
    public static function key(): string
    {
        return 'free';
    }

    public function label(): string
    {
        return 'Free shipping';
    }

    public function settingsSchema(): array
    {
        return [
            ['handle' => 'requires', 'type' => 'select', 'label' => 'Free when', 'config' => ['options' => [
                ['value' => 'always', 'label' => 'Always'],
                ['value' => 'min_subtotal', 'label' => 'The subtotal reaches a minimum'],
                ['value' => 'voucher', 'label' => 'A free-shipping voucher is used'],
            ]]],
            ['handle' => 'min_subtotal', 'type' => 'commerce_money', 'label' => 'Minimum subtotal', 'instructions' => 'After discounts.'],
        ];
    }

    public function settingsRules(): array
    {
        return ['requires' => ['nullable', 'in:always,min_subtotal,voucher']];
    }

    public function rates(ShippingRequest $request, ShippingMethod $method): array
    {
        $ok = match ($method->setting('requires', 'always')) {
            'min_subtotal' => $request->subtotal >= (int) $method->setting('min_subtotal', 0),
            'voucher' => $request->freeShippingVoucher,
            default => true,
        };

        return $ok ? [ShippingRate::for($method, 0)] : [];
    }
}
