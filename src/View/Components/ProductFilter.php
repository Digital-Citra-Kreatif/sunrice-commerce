<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Sunrice\Commerce\Catalog\PriceVisibility;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Taxonomy;

/**
 * <x-commerce::product-filter /> — the filter form (a GET form on the
 * current page): facets with counts, price range, stock, sale and sort.
 * Pass `without="brand"` on a brand page to leave out its own facet.
 */
class ProductFilter extends Component
{
    /** @var array<string, mixed> */
    public array $facets;

    /** @var array<string, string> taxonomy handle => title */
    public array $titles;

    public bool $prices;

    public function __construct(?ProductQuery $query = null, public string $without = '')
    {
        $query ??= ProductQuery::fromRequest(request());
        $this->facets = $query->facets();
        $this->titles = Taxonomy::query()->whereIn('handle', array_keys($this->facets['terms']))->pluck('title', 'handle')->all();
        $this->prices = app(PriceVisibility::class)->visible();
    }

    /** The query-string parameter for a taxonomy's terms. */
    public function param(string $taxonomy): string
    {
        return match ($taxonomy) {
            config('commerce.catalog.category_taxonomy') => 'category',
            config('commerce.catalog.brand_taxonomy') => 'brand',
            config('commerce.catalog.tag_taxonomy') => 'tag',
            default => "attr[{$taxonomy}]",
        };
    }

    public function render(): View
    {
        return view(Layout::view('partials.filters'));
    }
}
