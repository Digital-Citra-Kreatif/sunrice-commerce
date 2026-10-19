{{--
    <x-commerce::wishlist-button>: add or remove a product from the wishlist. $productId, $saved.
    $compact (optional): the heart only, its label kept for screen readers (product cards).
--}}
@php($icon = \Sunrice\Commerce\Storefront\Layout::view('partials.icon'))
@if ($saved)
    <form method="POST" action="{{ commerce_url('commerce.wishlist.remove', ['product' => $productId]) }}" @class(['commerce-wishlist-button', 'commerce-wishlist-button--compact' => $compact ?? false]) data-commerce-wishlist>
        @csrf @method('DELETE')
        <button type="submit" aria-pressed="true">@include($icon, ['name' => 'heart'])<span class="commerce-wishlist-button__label">{{ __('commerce::storefront.wishlist.saved') }}</span></button>
    </form>
@else
    <form method="POST" action="{{ commerce_url('commerce.wishlist.add') }}" @class(['commerce-wishlist-button', 'commerce-wishlist-button--compact' => $compact ?? false]) data-commerce-wishlist>
        @csrf
        <input type="hidden" name="product" value="{{ $productId }}">
        <button type="submit" aria-pressed="false">@include($icon, ['name' => 'heart'])<span class="commerce-wishlist-button__label">{{ __('commerce::storefront.wishlist.add') }}</span></button>
    </form>
@endif
