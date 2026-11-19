{{-- $products: the current page of product entries. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<table class="commerce-product-table" aria-label="{{ __('commerce::storefront.listing.table') }}">
    <thead>
        <tr>
            <th scope="col">{{ __('commerce::storefront.listing.product_column') }}</th>
            <th scope="col">{{ __('commerce::storefront.listing.price') }}</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($products as $entry)
            @php($image = collect(commerce_values($entry)['gallery'] ?? [])->first(fn ($value) => is_object($value)))
            @php($product = commerce_product($entry))
            <tr>
                <th scope="row">
                    <a href="{{ $entry->url() }}">
                        @if ($image)
                            <img src="{{ $image->url('thumb') }}" alt="" width="44" height="55" loading="lazy">
                        @endif
                        {{ $entry->title }}
                    </a>
                </th>
                <td>
                    @if ($product)
                        @include($L::view('partials.price'), ['hideIncludedTax' => true])
                    @endif
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
