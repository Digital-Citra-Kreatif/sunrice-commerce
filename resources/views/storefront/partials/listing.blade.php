{{--
    A product listing with its filters: the filter column (a drawer on
    small screens, opened by the "Filter" button), the active filters as
    chips, the products and their pages. Used by the shop, category,
    brand and tag pages. $query (Catalog\ProductQuery), $without (the
    page's own facet: category, brand, tag or '').
--}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<div class="commerce-listing" data-commerce-listing>
    <aside class="commerce-listing__filters" data-commerce-filter-panel>
        <x-commerce::product-filter :query="$query" :without="$without" />
    </aside>
    <div class="commerce-listing__main">
        <div class="commerce-listing__toolbar">
            <button type="button" class="commerce-button commerce-button--secondary commerce-listing__filter-button" data-commerce-filters-open aria-controls="commerce-filters" aria-expanded="false" hidden>
                @include($L::view('partials.icon'), ['name' => 'filter'])
                <span>{{ __('commerce::storefront.theme.filter_sort') }}</span>
            </button>
            @include($L::view('partials.active-filters'), ['query' => $query, 'without' => $without])
        </div>
        <x-commerce::products :query="$query" />
    </div>
</div>
