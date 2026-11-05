<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts;

use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;

/**
 * Whether a variant is sold out, or can be ordered again, for stock
 * alerts. Two questions, for the smallest quantity it is sold in: is
 * there enough stock (the Inventory contract; a bundle by its
 * components), and does the checkout's own rule (Catalog::check()) allow
 * the product otherwise. What depends on who is buying (hidden prices, a
 * flash sale's per-customer limit) doesn't count, and as Catalog stops
 * at the first reason, stock is always checked here.
 */
class Restock
{
    /** Catalog::check() reasons that don't stop a product: they depend on the buyer, or are about stock. */
    protected const ALLOWED = [null, 'price_hidden', 'flash_sale_limit', 'out_of_stock'];

    public function __construct(protected Catalog $catalog, protected Inventory $inventory, protected Bundles $bundles) {}

    public function soldOut(Variant $variant): bool
    {
        // Enough in stock settles it first (the product page asks for every variant).
        return ! $this->inStock($variant) && $this->sellable($variant);
    }

    public function orderable(Variant $variant): bool
    {
        return $this->inStock($variant) && $this->sellable($variant);
    }

    protected function inStock(Variant $variant): bool
    {
        $product = $variant->product;
        $available = $product->isBundle() ? $this->bundles->available($product) : $this->inventory->available($variant);

        return $available >= $this->quantity($variant);
    }

    protected function sellable(Variant $variant): bool
    {
        return in_array($this->catalog->check($variant, $this->quantity($variant))->reason, self::ALLOWED, true);
    }

    /** The smallest quantity the variant can be ordered in. */
    protected function quantity(Variant $variant): int
    {
        return $variant->min_qty >= 1 ? $variant->min_qty : max(1, $variant->qty_step);
    }
}
