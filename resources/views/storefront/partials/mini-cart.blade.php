{{--
    <x-commerce::mini-cart>: a link to the cart with the item count. With
    commerce.js the link opens a drawer (a <dialog>: focus stays inside,
    Escape closes it and focus returns to the link). $count
--}}
<a class="commerce-mini-cart" href="{{ commerce_url('commerce.cart') }}" data-commerce-mini-cart data-commerce-cart-api="{{ commerce_url('commerce.api.cart') }}" aria-haspopup="dialog">
    <span class="commerce-mini-cart__label">{{ __('commerce::storefront.cart.title') }}</span>
    <span class="commerce-mini-cart__count" data-commerce-cart-count @if ($count === 0) hidden @endif>{{ $count }}</span>
</a>
@once
    <dialog class="commerce-drawer" data-commerce-drawer aria-labelledby="commerce-drawer-title">
        <div class="commerce-drawer__header">
            <h2 id="commerce-drawer-title">{{ __('commerce::storefront.cart.title') }}</h2>
            <button type="button" class="commerce-drawer__close" data-commerce-drawer-close aria-label="{{ __('commerce::storefront.cart.close') }}">×</button>
        </div>
        <div class="commerce-drawer__body" data-commerce-drawer-body aria-live="polite"></div>
        <div class="commerce-drawer__footer">
            <a class="commerce-button commerce-button--secondary" href="{{ commerce_url('commerce.cart') }}">{{ __('commerce::storefront.cart.view') }}</a>
            @if (\Illuminate\Support\Facades\Route::has('commerce.checkout'))
                <a class="commerce-button commerce-button--primary" href="{{ commerce_url('commerce.checkout') }}">{{ __('commerce::storefront.cart.checkout') }}</a>
            @endif
        </div>
    </dialog>
@endonce
