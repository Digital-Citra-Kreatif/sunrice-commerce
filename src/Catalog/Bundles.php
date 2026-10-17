<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Collection;
use Sunrice\Commerce\Catalog\Models\BundleItem;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Support\Money;

/**
 * Bundle products: their price (fixed, or the components' sum minus a
 * percentage or an amount), availability (the scarcest component),
 * weight, and the component lines they stand for.
 */
class Bundles
{
    /** The bundle's price from its pricing mode. */
    public function price(Product $bundle, Variant $variant): int
    {
        if ($bundle->bundle_pricing === null || $bundle->bundle_pricing === 'fixed') {
            return $variant->price;
        }
        $sum = 0;
        foreach ($this->items($bundle) as $item) {
            $sum += $item->variant->price * $item->quantity;
        }
        $value = (int) $bundle->bundle_value;

        return max(0, match ($bundle->bundle_pricing) {
            'percent_off' => $sum - Money::percentOf($sum, $value),
            'amount_off' => $sum - $value,
            default => $sum,
        });
    }

    /** How many bundles can be sold (PHP_INT_MAX when no component tracks stock). */
    public function available(Product $bundle): int
    {
        $available = PHP_INT_MAX;
        $items = $this->items($bundle);
        if ($items->isEmpty()) {
            return 0;
        }
        foreach ($items as $item) {
            $component = $item->variant;
            if ($component->trashed() || ! $component->active) {
                return 0;
            }
            if ($component->track_stock && $component->backorders === 'no') {
                $available = min($available, intdiv(max(0, (int) $component->stock_quantity), max(1, $item->quantity)));
            } elseif (! $component->track_stock && $component->stock_status === 'out_of_stock') {
                return 0;
            }
        }

        return $available;
    }

    /** Grams: the components' weights, unless the bundle has its own. */
    public function weight(Product $bundle, Variant $variant): ?int
    {
        if ($variant->weight !== null) {
            return $variant->weight;
        }
        $weight = 0;
        foreach ($this->items($bundle) as $item) {
            $weight += (int) $item->variant->weight * $item->quantity;
        }

        return $weight ?: null;
    }

    /**
     * The component lines $qty bundles stand for (for reservations and order items).
     *
     * @return array<int, array{variant: Variant, quantity: int}>
     */
    public function explode(Product $bundle, int $qty): array
    {
        return $this->items($bundle)->map(fn (BundleItem $item) => ['variant' => $item->variant, 'quantity' => $item->quantity * $qty])->values()->all();
    }

    /** @return Collection<int, BundleItem> */
    protected function items(Product $bundle): Collection
    {
        return $bundle->relationLoaded('bundleItems')
            ? $bundle->bundleItems
            : $bundle->bundleItems()->with('variant')->get();
    }
}
