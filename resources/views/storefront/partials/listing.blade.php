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
    <span class="commerce-visually-hidden" role="status" data-commerce-listing-status
        data-loading="{{ __('commerce::storefront.listing.updating') }}"></span>
    <aside class="commerce-listing__filters" data-commerce-filter-panel>
        <x-commerce::product-filter :query="$query" :without="$without" />
    </aside>
    <div class="commerce-listing__main" data-commerce-listing-results tabindex="-1">
        <div class="commerce-listing__toolbar">
            <button type="button" class="commerce-button commerce-button--secondary commerce-listing__filter-button" data-commerce-filters-open aria-controls="commerce-filters" aria-expanded="false" hidden>
                @include($L::view('partials.icon'), ['name' => 'filter'])
                <span>{{ __('commerce::storefront.theme.filter_sort') }}</span>
            </button>
            @include($L::view('partials.active-filters'), ['query' => $query, 'without' => $without])
            <nav class="commerce-listing__views" aria-label="{{ __('commerce::storefront.listing.view') }}">
                <a href="{{ url()->query(url()->current(), $params) }}" aria-label="{{ __('commerce::storefront.listing.grid') }}"
                    title="{{ __('commerce::storefront.listing.grid') }}" @unless ($table) aria-current="true" @endunless>
                    <svg class="commerce-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">
                        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>
                    </svg>
                </a>
                <a href="{{ url()->query(url()->current(), [...$params, 'view' => 'table']) }}" aria-label="{{ __('commerce::storefront.listing.table') }}"
                    title="{{ __('commerce::storefront.listing.table') }}" @if ($table) aria-current="true" @endif>
                    <svg class="commerce-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">
                        <path d="M4 5h16v14H4zM4 10h16M4 15h16M10 5v14"/>
                    </svg>
                </a>
            </nav>
        </div>
        <x-commerce::products :query="$query" :table="$table" />
    </div>
</div>
