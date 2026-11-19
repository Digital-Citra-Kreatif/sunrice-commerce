{{-- <x-commerce::products>: $products (paginator of entries), $paginate, $filters, $query. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<div class="commerce-products">
    @if ($filters)
        <x-commerce::product-filter :query="$query" />
    @endif
    @if ($products->isEmpty())
        @include($L::view('partials.empty'), [
            'title' => __('commerce::storefront.listing.empty'),
            'text' => $paginate && count(request()->except(['page', 'view'])) > 0 ? __('commerce::storefront.theme.empty_filters') : null,
            'action' => $paginate && count(request()->except(['page', 'view'])) > 0 ? ['url' => url()->query(url()->current(), request()->only('view')), 'label' => __('commerce::storefront.listing.reset')] : null,
            'icon' => 'search',
        ])
    @else
        @if ($paginate)
            <p class="commerce-products__count">{{ trans_choice('commerce::storefront.theme.products_count', $products->total(), ['count' => $products->total()]) }}</p>
        @endif
        @if ($table)
            <table class="commerce-product-table" aria-label="{{ __('commerce::storefront.listing.table') }}">
                <thead><tr><th scope="col">{{ __('commerce::storefront.listing.product_column') }}</th><th scope="col">{{ __('commerce::storefront.listing.price') }}</th></tr></thead>
                <tbody>
                    @foreach ($products as $entry)
                        @php($image = collect(commerce_values($entry)['gallery'] ?? [])->first(fn ($value) => is_object($value)))
                        @php($product = commerce_product($entry))
                        <tr>
                            <th scope="row"><a href="{{ $entry->url() }}">
                                @if ($image)
                                    <img src="{{ $image->url('thumb') }}" alt="" width="44" height="55" loading="lazy">
                                @endif
                                {{ $entry->title }}
                            </a></th>
                            <td>@if ($product) @include($L::view('partials.price')) @endif</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <div @class(['commerce-grid', 'commerce-grid--wide' => ! $paginate])>
                @foreach ($products as $entry)
                    @include($L::view('partials.product-card'), ['entry' => $entry])
                @endforeach
            </div>
        @endif
        @if ($paginate && $products->hasPages())
            <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">
                {{ $products->onEachSide(1)->links($L::view('partials.pagination')) }}
            </nav>
        @endif
    @endif
</div>
