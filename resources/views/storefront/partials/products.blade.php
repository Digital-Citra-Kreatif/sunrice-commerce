{{-- <x-commerce::products>: $products (paginator of entries), $paginate, $filters, $query. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<div class="commerce-products">
    @if ($filters)
        <x-commerce::product-filter :query="$query" />
    @endif
    @if ($products->isEmpty())
        @include($L::view('partials.empty'), [
            'title' => __('commerce::storefront.listing.empty'),
            'text' => $paginate && count(request()->except(['page'])) > 0 ? __('commerce::storefront.theme.empty_filters') : null,
            'action' => $paginate && count(request()->except(['page'])) > 0 ? ['url' => url()->current(), 'label' => __('commerce::storefront.listing.reset')] : null,
            'icon' => 'search',
        ])
    @else
        @if ($paginate)
            <p class="commerce-products__count">{{ trans_choice('commerce::storefront.theme.products_count', $products->total(), ['count' => $products->total()]) }}</p>
        @endif
        <div @class(['commerce-grid', 'commerce-grid--wide' => ! $paginate])>
            @foreach ($products as $entry)
                @include($L::view('partials.product-card'), ['entry' => $entry])
            @endforeach
        </div>
        @if ($paginate && $products->hasPages())
            <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">
                {{ $products->onEachSide(1)->links($L::view('partials.pagination')) }}
            </nav>
        @endif
    @endif
</div>
