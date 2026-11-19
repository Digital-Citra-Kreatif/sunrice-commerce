{{-- $cart: the cart view with its calculation state. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<aside class="commerce-cart__summary" aria-labelledby="commerce-cart-summary">
    <h2 class="commerce-cart__summary-title" id="commerce-cart-summary">{{ __('commerce::storefront.theme.order_summary') }}</h2>
    @include($L::view('partials.totals'), ['state' => $cart->state])
    <x-commerce::slot name="cart.totals_after" :cart="$cart" />

    @if (\Illuminate\Support\Facades\Route::has('commerce.checkout') && commerce_feature('checkout'))
        <a class="commerce-button commerce-button--primary commerce-button--block commerce-cart__checkout" href="{{ commerce_url('commerce.checkout') }}">{{ __('commerce::storefront.cart.checkout') }}</a>
    @endif
    <ul class="commerce-cart__assurances">
        <li>@include($L::view('partials.icon'), ['name' => 'truck']) {{ __('commerce::storefront.theme.shipping_estimate') }}</li>
        <li>@include($L::view('partials.icon'), ['name' => 'check']) {{ __('commerce::storefront.theme.secure_checkout') }}</li>
    </ul>
</aside>
