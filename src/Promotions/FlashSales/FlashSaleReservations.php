<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Support\Facades\DB;

/**
 * Units sold at a flash sale price, counted atomically when an order is
 * placed (so a cap can't be oversold) and given back on cancellation.
 */
class FlashSaleReservations
{
    /** Whether $qty more units fit under the item's cap (and were counted). */
    public function reserve(int $itemId, int $qty): bool
    {
        return DB::table('commerce_flash_sale_items')->where('id', $itemId)
            ->where(fn ($q) => $q->whereNull('quantity_limit')->orWhereRaw('sold_quantity + ? <= quantity_limit', [$qty]))
            ->update(['sold_quantity' => DB::raw('sold_quantity + '.(int) $qty), 'updated_at' => now()]) === 1;
    }

    public function release(int $itemId, int $qty): void
    {
        DB::table('commerce_flash_sale_items')->where('id', $itemId)
            ->update(['sold_quantity' => DB::raw('CASE WHEN sold_quantity >= '.(int) $qty.' THEN sold_quantity - '.(int) $qty.' ELSE 0 END'), 'updated_at' => now()]);
    }
}
