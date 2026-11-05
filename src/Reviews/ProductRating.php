<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews;

use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Reviews\Models\Review;

/** A product's rating from its approved reviews, stored on the product for listings and its JSON-LD. */
class ProductRating
{
    public static function refresh(int $productId): void
    {
        $approved = Review::query()->approved()->where('product_id', $productId);
        $count = (clone $approved)->count();
        Product::query()->whereKey($productId)->update([
            'rating_count' => $count,
            'rating_average' => $count > 0 ? round((float) $approved->avg('rating'), 2) : null,
        ]);
    }

    /**
     * How many approved reviews gave each rating, 5 to 1.
     *
     * @return array<int, int>
     */
    public static function breakdown(int $productId): array
    {
        $counts = Review::query()->approved()->where('product_id', $productId)->groupBy('rating')->selectRaw('rating, count(*) as total')->pluck('total', 'rating');

        return array_combine([5, 4, 3, 2, 1], array_map(fn (int $r) => (int) ($counts[$r] ?? 0), [5, 4, 3, 2, 1]));
    }
}
