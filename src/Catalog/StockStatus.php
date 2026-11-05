<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;

/**
 * A variant's stock as the storefront shows it: in_stock, backorder or
 * out_of_stock, from the Inventory contract (so an external stock source
 * counts) and, for a bundle, from its components.
 */
class StockStatus
{
    public function __construct(protected Inventory $inventory, protected Bundles $bundles) {}

    public function of(Product $product, Variant $variant): string
    {
        if ($product->isBundle()) {
            return $this->bundles->available($product) > 0 ? 'in_stock' : 'out_of_stock';
        }
        $backorders = $variant->track_stock && $variant->backorders !== 'no';
        if ($this->inventory->available($variant) > 0) {
            return $backorders && (int) $variant->stock_quantity <= 0 ? 'backorder' : 'in_stock';
        }

        return $backorders || $variant->stock_status === 'backorder' ? 'backorder' : 'out_of_stock';
    }

    public function soldOut(Variant $variant): bool
    {
        return $this->of($variant->product, $variant) === 'out_of_stock';
    }
}
