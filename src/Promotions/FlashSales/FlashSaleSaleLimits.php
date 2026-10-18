<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Contracts\Auth\Authenticatable;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\SaleLimits;
use Sunrice\Commerce\Pricing\PricingContext;

/**
 * The per-customer limit of a running flash sale (SPEC.md, flash sales):
 * while the sale price applies, adding more than the customer may still
 * buy is refused. When the sale's own quantity has run out the item is
 * back at its normal price and there is no limit.
 */
class FlashSaleSaleLimits implements SaleLimits
{
    public function __construct(protected ActiveSales $sales, protected FlashSaleLimits $limits) {}

    public function remaining(Variant $variant, mixed $customer = null): ?int
    {
        $item = $this->sales->for($variant);
        if ($item === null || ($item->remaining() !== null && $item->remaining() <= 0)) {
            return null;
        }
        $ctx = $customer instanceof Authenticatable ? PricingContext::for($customer) : PricingContext::current();

        return $this->limits->customerRemaining($item, $ctx);
    }
}
