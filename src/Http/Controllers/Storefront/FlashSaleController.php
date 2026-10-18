<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Entry;

/** GET /flash-sale (running and upcoming sales) and /flash-sale/{slug}. */
class FlashSaleController
{
    public function index(): View
    {
        abort_unless(commerce_feature('flash_sales'), 404);

        return view(Layout::view('flash-sales'), [
            'running' => FlashSale::query()->running()->orderBy('ends_at')->get(),
            'upcoming' => FlashSale::query()->upcoming()->where('show_teaser', true)->orderBy('starts_at')->limit(6)->get(),
            'seoTitle' => __('commerce::storefront.flash.title'),
        ]);
    }

    public function show(string $sale): View
    {
        abort_unless(commerce_feature('flash_sales'), 404);
        $model = FlashSale::query()->where('slug', $sale)->where('active', true)->firstOrFail();
        abort_if($model->ends_at->isPast() || ($model->starts_at->isFuture() && ! $model->show_teaser), 404);

        return view(Layout::view('flash-sale'), ['sale' => $model, 'products' => static::products($model), 'seoTitle' => $model->name]);
    }

    /** @return Collection<int, Entry> */
    public static function products(FlashSale $sale): Collection
    {
        $entryIds = Product::query()->whereIn('id', $sale->items()->pluck('product_id'))->pluck('entry_id')->all();

        return ProductQuery::make()->entries($entryIds)->get(100);
    }
}
