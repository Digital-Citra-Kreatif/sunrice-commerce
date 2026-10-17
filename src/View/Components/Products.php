<?php

declare(strict_types=1);

namespace Sunrice\Commerce\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\View\Component;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Entry;

/**
 * <x-commerce::products /> — a product grid with pagination, filtered by
 * the query string (and by attributes: category, brand, tag, featured,
 * on-sale, limit). Without `paginate`, shows the first `limit` products.
 *
 *     <x-commerce::products category="shirts" sort="newest" :limit="8" :paginate="false" />
 */
class Products extends Component
{
    /** @var LengthAwarePaginator<int, Entry> */
    public LengthAwarePaginator $products;

    public ProductQuery $query;

    public function __construct(
        ?string $category = null,
        ?string $brand = null,
        ?string $tag = null,
        ?string $sort = null,
        bool $featured = false,
        bool $onSale = false,
        public int $limit = 24,
        public bool $paginate = true,
        public bool $filters = false,
        ?ProductQuery $query = null,
    ) {
        $this->query = $query ?? ($paginate ? ProductQuery::fromRequest(request()) : ProductQuery::make());
        if ($category !== null) {
            $this->query->category($category);
        }
        if ($brand !== null) {
            $this->query->brand($brand);
        }
        if ($tag !== null) {
            $this->query->tag($tag);
        }
        if ($sort !== null && ! request()->filled('sort')) {
            $this->query->sort($sort);
        }
        $this->query->featured($featured)->onSale($onSale || request()->boolean('on_sale'));
        $this->products = $this->query->paginate($limit)->withQueryString();
    }

    public function render(): View
    {
        return view(Layout::view('partials.products'));
    }
}
