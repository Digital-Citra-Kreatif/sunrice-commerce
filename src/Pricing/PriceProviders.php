<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

use Sunrice\Commerce\Pricing\Contracts\DiscountProvider;
use Sunrice\Commerce\Pricing\Contracts\FeeProvider;
use Sunrice\Commerce\Pricing\Contracts\PriceCandidateProvider;
use Sunrice\Commerce\Pricing\Contracts\ShippingDiscountProvider;

/** The registered price candidate, discount, shipping discount and fee providers. */
class PriceProviders
{
    /** @var array<class-string<PriceCandidateProvider>, int> */
    protected array $prices = [Providers\BasePrice::class => 0];

    /** @var array<int, class-string<DiscountProvider>> */
    protected array $discounts = [];

    /** @var array<int, class-string<ShippingDiscountProvider>> */
    protected array $shippingDiscounts = [];

    /** @var array<int, class-string<FeeProvider>> */
    protected array $fees = [];

    /** @param  class-string<PriceCandidateProvider>  $class  (order matters only for ties: lower first) */
    public function price(string $class, int $order = 100): void
    {
        $this->prices[$class] = $order;
    }

    /** @param  class-string<DiscountProvider>  $class */
    public function discount(string $class): void
    {
        $this->discounts[] = $class;
    }

    /** @param  class-string<ShippingDiscountProvider>  $class */
    public function shippingDiscount(string $class): void
    {
        $this->shippingDiscounts[] = $class;
    }

    /** @param  class-string<FeeProvider>  $class */
    public function fee(string $class): void
    {
        $this->fees[] = $class;
    }

    /** @return array<int, PriceCandidateProvider> */
    public function all(): array
    {
        $prices = $this->prices;
        asort($prices);

        return array_map(fn (string $class) => app($class), array_keys($prices));
    }

    /** @return array<int, DiscountProvider> in priority order */
    public function discounts(): array
    {
        $providers = array_map(fn (string $class) => app($class), array_unique($this->discounts));
        usort($providers, fn (DiscountProvider $a, DiscountProvider $b) => $a->priority() <=> $b->priority());

        return $providers;
    }

    /** @return array<int, ShippingDiscountProvider> */
    public function shippingDiscounts(): array
    {
        return array_map(fn (string $class) => app($class), array_unique($this->shippingDiscounts));
    }

    /** @return array<int, FeeProvider> */
    public function fees(): array
    {
        return array_map(fn (string $class) => app($class), array_unique($this->fees));
    }
}
