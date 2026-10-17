{{--
    Store links for the site header: account, wishlist and the mini cart.
    Add to your header partial:
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.header-links'))
--}}
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
<nav class="commerce-header-links" aria-label="{{ __('commerce::storefront.header.label') }}">
    @if (commerce_feature('accounts') && \Illuminate\Support\Facades\Route::has('commerce.account'))
        <a href="{{ commerce_url('commerce.account') }}">{{ commerce_customer() ? __('commerce::account.overview.title') : __('commerce::account.login.title') }}</a>
    @endif
    @if (commerce_feature('wishlist') && \Illuminate\Support\Facades\Route::has('commerce.wishlist'))
        <a href="{{ commerce_url('commerce.wishlist') }}">{{ __('commerce::storefront.wishlist.title') }}</a>
    @endif
    @if (commerce_feature('cart'))
        <x-commerce::mini-cart />
    @endif
</nav>
