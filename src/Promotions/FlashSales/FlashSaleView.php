<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** Adds the running (or, as a teaser, upcoming) flash sale to product views: countdown and progress. */
final class FlashSaleView
{
    public static function extend(ProductView $view): ProductView
    {
        if ($view->price['hidden']) {
            return $view;
        }
        $sales = app(ActiveSales::class);
        $item = $view->product->variants->map(fn (Variant $v) => $sales->for($v))->filter()->first();
        if (! $item instanceof FlashSaleItem) {
            return $view;
        }
        $sale = $item->sale;
        $data = [
            'id' => $sale->id,
            'name' => $sale->name,
            'badge' => $sale->badge,
            'ends_at' => $sale->ends_at->toIso8601String(),
            'countdown' => $sale->show_countdown,
            'sold' => $item->sold_quantity,
            'limit' => $item->quantity_limit,
            'sold_percent' => $sale->show_progress && $item->quantity_limit ? min(100, (int) floor(100 * $item->sold_quantity / max(1, $item->quantity_limit))) : null,
            'url' => Route::has('commerce.flash-sale.show') ? StorefrontRoutes::url('commerce.flash-sale.show', ['sale' => $sale->slug]) : null,
        ];

        return $view->with(flashSale: $data, badges: array_values(array_unique([...$view->badges, 'sale'])));
    }
}
