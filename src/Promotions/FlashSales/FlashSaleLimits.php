<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Sunrice\Commerce\Pricing\PricingContext;

/**
 * Flash sale per-customer limits. Neither the cap nor the limit blocks
 * buying: past them, the regular price applies (with a notice).
 */
class FlashSaleLimits
{
    public function __construct(protected CustomerPurchases $purchases) {}

    /** Units this customer may still buy at the sale price (null: no limit). */
    public function customerRemaining(FlashSaleItem $item, PricingContext $ctx): ?int
    {
        $limit = $item->customerLimit();

        return $limit === null ? null : max(0, $limit - $this->purchases->count($item, $ctx));
    }
}
