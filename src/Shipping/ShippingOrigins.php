<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Closure;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\Address;
use Sunrice\Commerce\Support\Coordinates;

/**
 * Where a cart ships from: the store address (Settings → Store → General),
 * or the shipping origin set apart from it,
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

    /**
     * Where the store ships from when nothing else says: the store address, or the
     * shipping origin set apart from it (Settings → General → Ship from the store address off).
     */
    public static function store(): Address
    {
        $settings = app(StoreSettings::class);
        $origin = (array) $settings->get('general.origin', []);
        $separate = $settings->get('general.ship_from_store', true) === false && filled($origin['line1'] ?? null);

        return self::address($separate ? $origin : (array) $settings->get('general.address', []));
    }

    /** The store address as saved (invoices and documents), with its map point. */
    public static function storeAddress(): Address
    {
        return self::address((array) app(StoreSettings::class)->get('general.address', []));
    }

    /** @param  array<string, mixed>  $address  a settings address: line1, line2, region {…}, postal_code, coordinates */
    protected static function address(array $address): Address
    {
        return Address::fromArray([...$address, ...(array) ($address['region'] ?? []), ...(Coordinates::parse($address['coordinates'] ?? null) ?? [])]);
    }
}
