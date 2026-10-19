{{--
    Store links for the site header: account, wishlist and the mini cart,
    each an icon with its label (the starter header hides the labels on
    small screens, keeping them for screen readers). Add to your header:
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.header-links'))
--}}
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
<nav class="commerce-header-links" aria-label="{{ __('commerce::storefront.header.label') }}">
    @if (commerce_feature('accounts') && \Illuminate\Support\Facades\Route::has('commerce.account'))
        <a class="commerce-header-links__link" href="{{ commerce_url('commerce.account') }}">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => 'user'])
            <span class="commerce-header-links__label">{{ commerce_customer() ? __('commerce::account.overview.title') : __('commerce::account.login.title') }}</span>
        </a>
    @endif
    @if (commerce_feature('wishlist') && \Illuminate\Support\Facades\Route::has('commerce.wishlist'))
        <a class="commerce-header-links__link" href="{{ commerce_url('commerce.wishlist') }}">
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => 'heart'])
            <span class="commerce-header-links__label">{{ __('commerce::storefront.wishlist.title') }}</span>
        </a>
    @endif
    @if (commerce_feature('cart'))
        <x-commerce::mini-cart />
    @endif
</nav>
