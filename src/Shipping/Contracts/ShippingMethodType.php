<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Contracts;

use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;

/**
 * A kind of shipping method (free, flat, by weight, pickup, a carrier's
 * live rates). Each zone's methods are instances with their own settings.
 * Register with Commerce::registerShippingMethodType().
 */
interface ShippingMethodType
{
    /** e.g. 'free', 'flat', 'weight', 'pickup', 'rajaongkir' */
    public static function key(): string;

    /** The admin name. */
    public function label(): string;

    /**
     * Sunrice field definitions of the method's own settings (stored in `settings`).
     *
     * @return array<int, array<string, mixed>>
     */
    public function settingsSchema(): array;

    /** @return array<string, mixed> extra validation rules, keyed by setting */
    public function settingsRules(): array;

    /**
     * Rates for the request (none: the method doesn't apply).
     *
     * @return array<int, ShippingRate>
     */
    public function rates(ShippingRequest $request, ShippingMethod $method): array;
}
