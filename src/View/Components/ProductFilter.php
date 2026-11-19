<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Sunrice\Cms\Models\Taxonomy;
use Sunrice\Cms\Models\Term;
use Sunrice\Commerce\Catalog\PriceVisibility;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Storefront\Layout;

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

    /**
     * Load ancestors in batches, including parents with no products of their own.
     *
     * @param  Collection<int, Term>  $categories
     * @return array<int, string>
     */
    public function categoryLabels(Collection $categories): array
    {
        $known = $frontier = $categories->keyBy('id');
        $queried = $known->keys();
        while ($frontier->isNotEmpty()) {
            $parents = $frontier->pluck('parent_id')->filter()->unique()->diff($queried);
            if ($parents->isEmpty()) {
                break;
            }
            $frontier = Term::query()->with('translations')->whereKey($parents->all())->get()->keyBy('id');
            $known = $known->union($frontier);
            $queried = $queried->concat($parents);
        }

        $labels = [];
        foreach ($categories as $category) {
            $path = [];
            for ($node = $category; $node !== null && ! isset($path[$node->id]); $node = $known->get($node->parent_id ?? 0)) {
                $path[$node->id] = $node->title();
            }
            $labels[$category->id] = implode(' › ', array_reverse($path));
        }

        return $labels;
    }

    public function render(): View
    {
        return view(Layout::view('partials.filters'));
    }
}
