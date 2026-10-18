<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Models\Term;

/** GET /brands — every brand with live products. */
class BrandsController
{
    public function __invoke(): View
    {
        abort_unless(commerce_feature('brands'), 404);
        $handle = (string) config('commerce.catalog.brand_taxonomy', 'brands');
        $facet = ProductQuery::make()->facets()['terms'][$handle] ?? [];
        $terms = Term::query()->with('translations')->whereIn('id', array_column($facet, 'id'))->get()->keyBy('id');

        $brands = [];
        foreach ($facet as $row) {
            $term = $terms->get($row['id']);
            if ($term === null) {
                continue;
            }
            $term->resolveFor(app()->getLocale());
            $logo = $term->get('logo');
            $brands[] = ['name' => $row['name'], 'count' => $row['count'], 'url' => $term->url, 'logo' => is_object($logo) && method_exists($logo, 'url') ? $logo->url() : null];
        }

        return view(Layout::view('brands'), ['brands' => $brands, 'seoTitle' => __('commerce::storefront.listing.brands')]);
    }
}
