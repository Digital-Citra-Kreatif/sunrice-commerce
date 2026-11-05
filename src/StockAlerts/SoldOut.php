<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts;

use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * Whether a variant is sold out as the product page shows it: a bundle by
 * its components (Bundles::available()), anything else by its stock status.
 */
class SoldOut
{
    public function __construct(protected Bundles $bundles) {}

    public function variant(Variant $variant): bool
    {
        $product = $variant->product;

        return $product->isBundle() ? $this->bundles->available($product) <= 0 : $variant->stock_status === 'out_of_stock';
    }
}
