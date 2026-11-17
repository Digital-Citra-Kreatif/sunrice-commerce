<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Closure;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Address;

/**
 * Where a cart ships from: the store address (Settings → Store → General),
 * unless an extension's resolver (Commerce::shippingOriginUsing()) names
 * another for this cart, such as the branch that has the goods. The first
 * resolver that answers wins.
 */
final class ShippingOrigins
{
    /** @var list<Closure(CalculationState): (Address|array<string, mixed>|null)> */
    protected array $resolvers = [];

    /** @param  Closure(CalculationState): (Address|array<string, mixed>|null)  $resolver */
    public function register(Closure $resolver): void
    {
        $this->resolvers[] = $resolver;
    }

    /** An extension's origin for this cart, or null for the store address. */
    public function custom(CalculationState $state): ?Address
    {
        foreach ($this->resolvers as $resolver) {
            $origin = $resolver($state);
            if ($origin instanceof Address) {
                return $origin;
            }
            if (is_array($origin) && $origin !== []) {
                return Address::fromArray($origin);
            }
        }

        return null;
    }

    public function forState(CalculationState $state): Address
    {
        return $this->custom($state) ?? self::store();
    }

    /** The store address, the origin when nothing else says. */
    public static function store(): Address
    {
        $address = (array) app(StoreSettings::class)->get('general.address', []);

        return Address::fromArray([...$address, ...(array) ($address['region'] ?? [])]);
    }
}
