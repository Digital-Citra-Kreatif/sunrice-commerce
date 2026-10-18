<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\PriceIndex;
use Sunrice\Commerce\Promotions\FlashSales\Events\FlashSaleEnded;
use Sunrice\Commerce\Promotions\FlashSales\Events\FlashSaleStarted;

/**
 * commerce:tick step: sales that started or ended since the last tick
 * refresh their products' listing prices, bump the catalog version and
 * fire FlashSaleStarted / FlashSaleEnded (once each).
 */
class FlashSaleBoundaries
{
    public const LAST_TICK = 'commerce:flash-sales:last-tick';

    public function __invoke(): void
    {
        $now = now();
        $last = Carbon::createFromTimestamp((int) Cache::get(self::LAST_TICK, $now->copy()->subMinutes(2)->getTimestamp()));
        Cache::forever(self::LAST_TICK, $now->getTimestamp());

        $started = FlashSale::query()->where('active', true)->where('starts_at', '>', $last)->where('starts_at', '<=', $now)->get();
        $ended = FlashSale::query()->where('active', true)->where('ends_at', '>', $last)->where('ends_at', '<=', $now)->get();
        if ($started->isEmpty() && $ended->isEmpty()) {
            return;
        }

        app(ActiveSales::class)->flush();
        static::refresh($started->merge($ended)->pluck('id')->all());
        foreach ($started as $sale) {
            FlashSaleStarted::dispatch($sale);
        }
        foreach ($ended as $sale) {
            FlashSaleEnded::dispatch($sale);
        }
    }

    /** @param  array<int, int>  $saleIds  re-index the products of these sales */
    public static function refresh(array $saleIds): void
    {
        app(ActiveSales::class)->flush();
        $productIds = FlashSaleItem::query()->whereIn('flash_sale_id', $saleIds)->distinct()->pluck('product_id');
        foreach (Product::query()->whereIn('id', $productIds)->get() as $product) {
            app(PriceIndex::class)->refresh($product);
        }
        CatalogVersion::bump();
    }
}
