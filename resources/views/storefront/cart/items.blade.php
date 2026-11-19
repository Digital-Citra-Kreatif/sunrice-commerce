{{-- $lines: a paginator of cart view rows. --}}
@php
    $L = \Sunrice\Commerce\Storefront\Layout::class;
    $money = app(\Sunrice\Commerce\Support\MoneyFormatter::class);
    $taxDisplay = app(\Sunrice\Commerce\Taxes\TaxDisplay::class);
    $imageIds = $lines->getCollection()->pluck('line.variant.image_asset_id')->filter()->unique()->all();
    $variantImages = $imageIds === [] ? collect() : \Sunrice\Admin\Media\Media::query()->whereKey($imageIds)->get()->filter->isImage()->keyBy('id');
@endphp
<table class="commerce-cart__lines">
    <caption class="commerce-visually-hidden">{{ __('commerce::storefront.cart.title') }}</caption>
    <tbody>
        @foreach ($lines as $row)
            @include($L::view('cart.line'))
        @endforeach
    </tbody>
</table>
@if ($lines->hasPages())
    <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">
        {{ $lines->onEachSide(1)->links($L::view('partials.pagination')) }}
    </nav>
@endif
