{{-- $entry and $content: description, specifications, Q&A and size guide. --}}
<div class="commerce-product__details">
    @include(\Sunrice\Commerce\Storefront\Layout::view('product.description'))
    @include(\Sunrice\Commerce\Storefront\Layout::view('product.specifications'))
    @include(\Sunrice\Commerce\Storefront\Layout::view('product.size-guide'))
    @include(\Sunrice\Commerce\Storefront\Layout::view('product.questions'))
</div>
