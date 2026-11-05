<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Storefront\PageCache;

/**
 * Units sold at a flash sale price, counted atomically when an order is
 * placed (so a cap can't be oversold) and given back on cancellation.
 * Reaching the cap, or leaving it, clears the page cache and the feed.
 */
class FlashSaleReservations
{
    /** Whether $qty more units fit under the item's cap (and were counted). */
    public function reserve(int $itemId, int $qty): bool
    {
        $reserved = DB::table('commerce_flash_sale_items')->where('id', $itemId)
            ->where(fn ($q) => $q->whereNull('quantity_limit')->orWhereRaw('sold_quantity + ? <= quantity_limit', [$qty]))
            ->update(['sold_quantity' => DB::raw('sold_quantity + '.(int) $qty), 'updated_at' => now()]) === 1;
        // The last discounted unit sold: pages and the feed show the regular price from now on.
        if ($reserved && $this->atCap($itemId)) {
            PageCache::forget('flash_sale_sold_out');
        }

        return $reserved;
    }

    public function release(int $itemId, int $qty): void
    {
        $wasAtCap = $this->atCap($itemId);
        DB::table('commerce_flash_sale_items')->where('id', $itemId)
            ->update(['sold_quantity' => DB::raw('CASE WHEN sold_quantity >= '.(int) $qty.' THEN sold_quantity - '.(int) $qty.' ELSE 0 END'), 'updated_at' => now()]);
        // Units given back under a reached cap: the sale price shows again.
        if ($wasAtCap && $qty > 0) {
            PageCache::forget('flash_sale_back');
        }
    }

    protected function atCap(int $itemId): bool
    {
        return DB::table('commerce_flash_sale_items')->where('id', $itemId)->whereNotNull('quantity_limit')
            ->whereColumn('sold_quantity', '>=', 'quantity_limit')->exists();
    }
}
