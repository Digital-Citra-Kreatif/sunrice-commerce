{{--
    <x-commerce::cart>: $cart (Sunrice\Commerce\Cart\CartView), $lines (this page of $cart->lines, a paginator).
    The lines on the left, the summary and checkout on the right, and cross-sells
    below. Every form posts without JavaScript.
--}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
@php($continueShopping = app(\Sunrice\Commerce\Storefront\ShoppingDestination::class)->url())
<div class="commerce-cart" data-commerce-cart>
    @include($L::view('partials.messages'))
    @foreach (collect($cart->state->notices)->whereNotIn('code', ['voucher_conditional']) as $notice)
        <p class="commerce-notice commerce-notice--{{ $notice['code'] }}">{{ $notice['message'] }}</p>
    @endforeach

    @if ($cart->isEmpty())
        <div class="commerce-cart__empty">
            @include($L::view('partials.empty'), ['title' => __('commerce::storefront.cart.empty'), 'text' => __('commerce::storefront.theme.cart_empty_text'), 'icon' => 'bag',
                'action' => ['url' => $continueShopping, 'label' => __('commerce::storefront.cart.continue')]])
        </div>
    @else
        <div class="commerce-cart__layout">
            <div class="commerce-cart__items">
                @include($L::view('cart.items'))
                <x-commerce::slot name="cart.after_items" :cart="$cart" />
                <p class="commerce-cart__continue"><a href="{{ $continueShopping }}">← {{ __('commerce::storefront.cart.continue') }}</a></p>
            </div>

            @include($L::view('cart.summary'))
        </div>

        @include($L::view('cart.remove-dialog'))

        @include($L::view('cart.cross-sells'))
    @endif
</div>
