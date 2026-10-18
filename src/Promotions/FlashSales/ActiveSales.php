<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Support\Collection;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Features\Features;

/**
 * The running flash sale item for a variant (ARCHITECTURE.md §9.2): an
 * item for that variant, or for its product with no variant. Loaded once
 * per request.
 */
class ActiveSales
{
    /** @var Collection<int, FlashSaleItem>|null */
    protected ?Collection $items = null;

    /** @var array{0: array<int, FlashSaleItem>, 1: array<int, FlashSaleItem>}|null items by variant id, and product-wide items by product id */
    protected ?array $index = null;

    public function __construct(protected Features $features) {}

    /** @return Collection<int, FlashSaleItem> items of running sales */
    public function items(): Collection
    {
        if (! $this->features->active('flash_sales')) {
            return collect();
        }

        return $this->items ??= FlashSaleItem::query()->with('sale')
            ->whereIn('flash_sale_id', FlashSale::query()->running()->select('id'))
            ->get();
    }

    /** Called for every variant of every product shown, so it looks items up by key rather than scanning them. */
    public function for(Variant $variant): ?FlashSaleItem
    {
        if (! $this->features->active('flash_sales')) {
            return null;
        }
        if ($this->index === null) {
            $this->index = [[], []];
            foreach ($this->items() as $item) {
                if ($item->variant_id !== null) {
                    $this->index[0][$item->variant_id] ??= $item;
                } else {
                    $this->index[1][$item->product_id] ??= $item;
                }
            }
        }

        return $this->index[0][$variant->id] ?? $this->index[1][$variant->product_id] ?? null;
    }

    public function flush(): void
    {
        $this->items = null;
        $this->index = null;
    }
}
