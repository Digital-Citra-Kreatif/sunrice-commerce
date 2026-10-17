{{-- <x-commerce::products>: $products (paginator of entries), $paginate, $filters. --}}
<div class="commerce-products">
    @if ($filters)
        <x-commerce::product-filter :query="$query" />
    @endif
    @if ($products->isEmpty())
        <p class="commerce-products__empty">{{ __('commerce::storefront.listing.empty') }}</p>
    @else
        <div class="commerce-grid">
            @foreach ($products as $entry)
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $entry])
            @endforeach
        </div>
        @if ($paginate && $products->hasPages())
            <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">
                {{ $products->onEachSide(1)->links() }}
            </nav>
        @endif
    @endif
</div>
