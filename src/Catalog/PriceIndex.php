<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Illuminate\Support\Collection;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * The listing columns of a product: everyone's current min/max price
 * (including active flash sales, through price adjusters), regular
 * prices, on_sale and in_stock.
 */
class PriceIndex
{
    /** @var array<int, Closure(Product, Variant, int): int> */
    protected array $adjusters = [];

    /**
     * Change a variant's current price for everyone (e.g. an active flash
     * sale): receives the product, the variant and the price so far.
     *
     * @param  Closure(Product, Variant, int): int  $adjuster
     */
    public function adjustUsing(Closure $adjuster): void
    {
        $this->adjusters[] = $adjuster;
    }

    public function refresh(Product $product): void
    {
        $variants = $product->activeVariants()->get();
        $current = [];
        $regular = [];
        $onSale = false;
        foreach ($variants as $variant) {
            $variant->setRelation('product', $product);
            $price = $this->basePrice($product, $variant);
            foreach ($this->adjusters as $adjuster) {
                $price = $adjuster($product, $variant, $price);
            }
            $regularPrice = max($this->basePrice($product, $variant), (int) $variant->compare_at_price);
            $current[] = $price;
            $regular[] = $regularPrice;
            $onSale = $onSale || $price < $regularPrice;
        }

        $product->forceFill([
            'min_price' => $current === [] ? null : min($current),
            'max_price' => $current === [] ? null : max($current),
            'min_regular_price' => $regular === [] ? null : min($regular),
            'max_regular_price' => $regular === [] ? null : max($regular),
            'on_sale' => $onSale,
        ])->save();
        $this->refreshStock($product, $variants);
    }

    /** @param  Collection<int, Variant>|null  $variants */
    public function refreshStock(Product $product, ?Collection $variants = null): void
    {
        $variants ??= $product->activeVariants()->get();
        $inStock = $variants->contains(fn (Variant $v) => $v->computedStockStatus() !== 'out_of_stock');
        if ($product->isBundle()) {
            $inStock = $inStock && app(Bundles::class)->available($product) > 0;
        }
        if ($product->in_stock !== $inStock) {
            $product->forceFill(['in_stock' => $inStock])->save();
        }
    }

    /** The variant's own price; a bundle's price follows its pricing mode. */
    protected function basePrice(Product $product, Variant $variant): int
    {
        return $product->isBundle() ? app(Bundles::class)->price($product, $variant) : $variant->price;
    }
}
