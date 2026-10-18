<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Http\Controllers\Storefront\FlashSaleController;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale as Sale;
use Sunrice\Commerce\Storefront\Layout;

/**
 * <x-commerce::flash-sale /> — the running flash sale (or the one given
 * by slug) with its countdown and products; nothing when none runs.
 */
class FlashSale extends Component
{
    public ?Sale $sale;

    public function __construct(?string $slug = null, public int $limit = 8)
    {
        $this->sale = ! commerce_feature('flash_sales') ? null : ($slug !== null
            ? Sale::query()->running()->where('slug', $slug)->first()
            : Sale::query()->running()->orderBy('ends_at')->first());
    }

    public function shouldRender(): bool
    {
        return $this->sale !== null;
    }

    public function render(): View
    {
        return view(Layout::view('partials.flash-sale'), ['products' => FlashSaleController::products($this->sale)->take($this->limit)]);
    }
}
