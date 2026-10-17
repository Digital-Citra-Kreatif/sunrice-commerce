{{-- $product: Sunrice\Commerce\Catalog\ProductView --}}
<div class="commerce-price" data-commerce-price>
    @if ($product->price['hidden'])
        @if ($product->price['signIn'] && Route::has('commerce.account.login'))
            <a class="commerce-price__signin" href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::storefront.cta.sign_in_for_price') }}</a>
        @else
            <span class="commerce-price__hidden">{{ __('commerce::storefront.cta.price_on_request') }}</span>
        @endif
    @else
        @if ($product->price['compareFormatted'])
            <del class="commerce-price__compare" data-commerce-compare>{{ $product->price['compareFormatted'] }}</del>
        @endif
        <span class="commerce-price__amount" data-commerce-amount>{{ $product->price['formatted'] }}</span>
    @endif
</div>
