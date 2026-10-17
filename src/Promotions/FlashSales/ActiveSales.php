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

    public function for(Variant $variant): ?FlashSaleItem
    {
        $items = $this->items();

        return $items->first(fn (FlashSaleItem $i) => $i->variant_id === $variant->id)
            ?? $items->first(fn (FlashSaleItem $i) => $i->variant_id === null && $i->product_id === $variant->product_id);
    }

    public function flush(): void
    {
        $this->items = null;
    }
}
