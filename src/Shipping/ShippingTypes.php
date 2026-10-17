<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use InvalidArgumentException;
use Sunrice\Commerce\Shipping\Contracts\ShippingMethodType;

/** The registered shipping method types (built-ins and carrier packages). */
class ShippingTypes
{
    /** @var array<string, class-string<ShippingMethodType>> */
    protected array $types = [
        'free' => Types\FreeShipping::class,
        'flat' => Types\FlatRate::class,
        'weight' => Types\WeightBased::class,
        'pickup' => Types\LocalPickup::class,
    ];

    /** @param  class-string<ShippingMethodType>  $class */
    public function register(string $class): void
    {
        if (! is_subclass_of($class, ShippingMethodType::class)) {
            throw new InvalidArgumentException("{$class} must implement ".ShippingMethodType::class.'.');
        }
        $this->types[$class::key()] = $class;
    }

    public function has(string $key): bool
    {
        return isset($this->types[$key]);
    }

    public function get(string $key): ?ShippingMethodType
    {
        return isset($this->types[$key]) ? app($this->types[$key]) : null;
    }

    /** @return array<string, string> key => label */
    public function options(): array
    {
        $out = [];
        foreach ($this->types as $key => $class) {
            $out[$key] = app($class)->label();
        }

        return $out;
    }
}
