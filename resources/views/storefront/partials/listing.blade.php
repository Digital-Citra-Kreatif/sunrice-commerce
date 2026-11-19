{{--
    A product listing with its filters: the filter column (a drawer on
    small screens, opened by the "Filter" button), the active filters as
    chips, the products and their pages. Used by the shop, category,
    brand and tag pages. $query (Catalog\ProductQuery), $without (the
    page's own facet: category, brand, tag or '').
--}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($table = request('view') === 'table')
@php($params = request()->except(['page', 'view']))
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
            <nav class="commerce-listing__views" aria-label="{{ __('commerce::storefront.listing.view') }}">
                <a href="{{ url()->query(url()->current(), $params) }}" @unless ($table) aria-current="true" @endunless>{{ __('commerce::storefront.listing.grid') }}</a>
                <a href="{{ url()->query(url()->current(), [...$params, 'view' => 'table']) }}" @if ($table) aria-current="true" @endif>{{ __('commerce::storefront.listing.table') }}</a>
            </nav>
        </div>
        <x-commerce::products :query="$query" :table="$table" />
    </div>
</div>
