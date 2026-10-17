<a class="commerce-mini-cart" href="{{ commerce_url('commerce.cart') }}" data-commerce-mini-cart data-commerce-cart-api="{{ commerce_url('commerce.api.cart') }}">
    <span class="commerce-mini-cart__label">{{ __('commerce::storefront.cart.title') }}</span>
    <span class="commerce-mini-cart__count" data-commerce-cart-count @if ($count === 0) hidden @endif>{{ $count }}</span>
</a>
