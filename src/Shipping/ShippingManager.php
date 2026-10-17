<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Contracts\ShippingQuoter;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Types\FlatRate;
use Sunrice\Commerce\Shipping\Types\FreeShipping;
use Sunrice\Commerce\Shipping\Types\LocalPickup;
use Sunrice\Commerce\Shipping\Types\WeightBased;
use Throwable;

/**
 * Shipping rates for a calculation: the matched zone's active methods,
 * each asked by its type, filtered by the method's availability (min/max
 * subtotal, max weight). Pickup methods of any zone are offered even
 * before an address is entered. Carrier types are cached for 10 minutes
 * by request.
 */
class ShippingManager implements ShippingQuoter
{
    protected const BUILT_IN = [FreeShipping::class, FlatRate::class, WeightBased::class, LocalPickup::class];

    public function __construct(protected ZoneMatcher $zones, protected ShippingTypes $types) {}

    public function rates(CalculationState $state): array
    {
        $request = ShippingRequest::fromState($state);

        return array_map(fn (ShippingRate $r) => $r->toArray(), $this->quote($request));
    }

    /** @return array<int, ShippingRate> */
    public function quote(ShippingRequest $request): array
    {
        $methods = [];
        $zone = $request->destination === null ? null : $this->zones->match($request->destination);
        foreach ($zone === null ? [] : $zone->methods as $method) {
            $methods[$method->id] = $method;
        }
        // Pickup needs no address: offered from every zone.
        foreach ($this->zones->zones() as $other) {
            foreach ($other->methods as $method) {
                if ($method->type === LocalPickup::key()) {
                    $methods[$method->id] ??= $method;
                }
            }
        }
        uasort($methods, fn (ShippingMethod $a, ShippingMethod $b) => [$a->zone_id !== $zone?->id, $a->position, $a->id] <=> [$b->zone_id !== $zone?->id, $b->position, $b->id]);

        $rates = [];
        foreach ($methods as $method) {
            if (! $method->active || ($request->destination === null && $method->type !== LocalPickup::key()) || ! $this->available($method, $request)) {
                continue;
            }
            $type = $this->types->get($method->type);
            if ($type === null) {
                continue;
            }
            try {
                $found = in_array($type::class, self::BUILT_IN, true)
                    ? $type->rates($request, $method)
                    : Cache::remember('commerce:rates:'.$method->id.':'.md5(serialize($request)), 600, fn () => $type->rates($request, $method));
            } catch (Throwable $e) {
                report($e);

                continue;
            }
            array_push($rates, ...$found);
        }

        return $rates;
    }

    public function available(ShippingMethod $method, ShippingRequest $request): bool
    {
        $min = $method->setting('min_subtotal');
        $max = $method->setting('max_subtotal');
        $maxWeight = $method->setting('max_weight');

        return ($min === null || $min === '' || $request->subtotal >= (int) $min)
            && ($max === null || $max === '' || (int) $max === 0 || $request->subtotal <= (int) $max)
            && ($maxWeight === null || $maxWeight === '' || (float) $maxWeight <= 0 || $request->package->weight() <= (float) $maxWeight * 1000);
    }
}
