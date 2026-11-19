{{-- $entry, $product, $projectedProduct, $brand and $locale. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<div class="commerce-product__summary">
    @include($L::view('product.heading'))
    <x-commerce::slot name="product.after_summary" :entry="$entry" />
    <x-commerce::slot name="product.before_add_to_cart" :entry="$entry" />
    <x-commerce::product :entry="$entry" />
    <x-commerce::slot name="product.after_add_to_cart" :entry="$entry" />
    @include($L::view('product.actions'))
    @if ($product)
        @include($L::view('partials.product-extras'))
    @endif
</div>
