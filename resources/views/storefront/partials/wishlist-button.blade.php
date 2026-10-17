@if ($saved)
    <form method="POST" action="{{ commerce_url('commerce.wishlist.remove', ['product' => $productId]) }}" class="commerce-wishlist-button" data-commerce-wishlist>
        @csrf @method('DELETE')
        <button type="submit" aria-pressed="true">♥ {{ __('commerce::storefront.wishlist.saved') }}</button>
    </form>
@else
    <form method="POST" action="{{ commerce_url('commerce.wishlist.add') }}" class="commerce-wishlist-button" data-commerce-wishlist>
        @csrf
        <input type="hidden" name="product" value="{{ $productId }}">
        <button type="submit" aria-pressed="false">♡ {{ __('commerce::storefront.wishlist.add') }}</button>
    </form>
@endif
