<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts;

use Sunrice\Commerce\Catalog\Availability;
use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;

/**
 * Stock alerts ask Catalog::check() (the checkout's own rule) whether the
 * smallest quantity a variant can be ordered in can be bought: sold out
 * when stock is the only reason it can't, orderable when nothing stands
 * in the way but things that depend on who is buying (hidden prices, a
 * flash sale's per-customer limit).
 */
class Restock
{
    public function __construct(protected Catalog $catalog, protected Inventory $inventory, protected Bundles $bundles) {}

    public function soldOut(Variant $variant): bool
    {
        // Enough in stock settles it without the full check (the product page asks for every variant).
        $product = $variant->product;
        $available = $product->isBundle() ? $this->bundles->available($product) : $this->inventory->available($variant);
        if ($available >= $this->quantity($variant)) {
            return false;
        }

        return $this->check($variant)->reason === 'out_of_stock';
    }

    public function orderable(Variant $variant): bool
    {
        return in_array($this->check($variant)->reason, [null, 'price_hidden', 'flash_sale_limit'], true);
    }

    protected function check(Variant $variant): Availability
    {
        return $this->catalog->check($variant, $this->quantity($variant));
    }

    /** The smallest quantity the variant can be ordered in. */
    protected function quantity(Variant $variant): int
    {
        return $variant->min_qty >= 1 ? $variant->min_qty : max(1, $variant->qty_step);
    }
}
