<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Who is buying, when and how: what prices, discounts, shipping and taxes
 * depend on. Built from the storefront visitor, an order (manual orders,
 * quotes) or an MCP request.
 */
final class PricingContext
{
    /**
     * @param  array<int, string>  $roles
     * @param  array<string, mixed>|null  $destination  address: country, province_code, city_code, district_code, postal_code
     * @param  array<string, mixed>|null  $billingAddress  the billing address (taxes based on billing; falls back to the destination)
     * @param  array{shipping?: array{label: string, cost: int}, discount?: array{label: string, amount: int}}  $overrides  staff-set shipping and discount (admin and quote channels)
     */
    public function __construct(
        public readonly ?Authenticatable $customer = null,
        public readonly array $roles = [],
        public readonly ?CarbonImmutable $now = null,
        public readonly string $locale = 'id',
        public readonly string $channel = 'storefront',
        public readonly ?array $destination = null,
        public readonly ?string $shippingRate = null,
        public readonly ?string $paymentMethod = null,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
        public readonly bool $placing = false,
        public readonly array $overrides = [],
        public readonly ?array $billingAddress = null,
    ) {}

    public static function guest(): self
    {
        return new self(now: CarbonImmutable::now(), locale: app()->getLocale());
    }

    /** The storefront visitor (the commerce guard's customer, or a guest). */
    public static function current(): self
    {
        return self::for(commerce_customer());
    }

    public static function for(?Authenticatable $customer, string $channel = 'storefront'): self
    {
        $roles = $customer !== null && method_exists($customer, 'getRoleNames') ? $customer->getRoleNames()->all() : [];

        return new self(
            customer: $customer,
            roles: $roles,
            now: CarbonImmutable::now(),
            locale: app()->getLocale(),
            channel: $channel,
            email: $customer?->getAttribute('email'),
        );
    }

    /** Staff are pricing it (manual orders, editing, quotes): line prices and totals may be set by hand. */
    public function isStaff(): bool
    {
        return in_array($this->channel, ['admin', 'quote'], true);
    }

    public function isGuest(): bool
    {
        return $this->customer === null;
    }

    public function customerId(): ?int
    {
        $id = $this->customer?->getAuthIdentifier();

        return $id === null ? null : (int) $id;
    }

    public function now(): CarbonImmutable
    {
        return $this->now ?? CarbonImmutable::now();
    }

    /** @param  array<string, mixed>  $changes */
    public function with(array $changes): self
    {
        $values = get_object_vars($this);

        return new self(...array_replace($values, $changes));
    }
}
