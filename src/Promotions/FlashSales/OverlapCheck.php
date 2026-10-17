<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Sunrice\Commerce\Catalog\Models\Variant;

/** A variant can be in one running sale at a time: sales whose windows meet can't share variants. */
final class OverlapCheck
{
    /**
     * The name of a sale that overlaps, or null.
     *
     * @param  array<int, array{product_id: int, variant_id: int|null}>  $items
     */
    public static function conflict(array $items, \DateTimeInterface $starts, \DateTimeInterface $ends, ?int $exceptSaleId = null): ?string
    {
        $mine = self::variants($items);
        if ($mine === []) {
            return null;
        }
        $others = FlashSale::query()->with('items')->where('active', true)
            ->when($exceptSaleId !== null, fn ($q) => $q->whereKeyNot($exceptSaleId))
            ->where('starts_at', '<', $ends)->where('ends_at', '>', $starts)->get();
        foreach ($others as $sale) {
            $theirs = self::variants($sale->items->map(fn (FlashSaleItem $i) => ['product_id' => $i->product_id, 'variant_id' => $i->variant_id])->all());
            if (array_intersect($mine, $theirs) !== []) {
                return $sale->name;
            }
        }

        return null;
    }

    /**
     * @param  array<int, array{product_id: int, variant_id: int|null}>  $items
     * @return array<int, int>
     */
    protected static function variants(array $items): array
    {
        $ids = array_filter(array_column($items, 'variant_id'));
        $products = array_column(array_filter($items, fn ($i) => $i['variant_id'] === null), 'product_id');
        if ($products !== []) {
            $ids = [...$ids, ...Variant::query()->whereIn('product_id', $products)->pluck('id')->all()];
        }

        return array_values(array_unique(array_map('intval', $ids)));
    }
}
