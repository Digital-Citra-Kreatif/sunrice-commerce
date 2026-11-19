{{-- $product: Sunrice\Commerce\Catalog\ProductView --}}
<div class="commerce-price" data-commerce-price>
    @if ($product->price['hidden'])
        @if ($product->price['signIn'] && Route::has('commerce.account.login'))
            <a class="commerce-price__signin" href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::storefront.cta.sign_in_for_price') }}</a>
        @else
            <span class="commerce-price__hidden">{{ __('commerce::storefront.cta.price_on_request') }}</span>
        @endif
    @else
        @php($compare = isset($variantPrice) ? $variantPrice['compare_at'] : $product->price['compareFormatted'])
        @if ($compare || ($updateVariantPrice ?? false))
            <del class="commerce-price__compare" data-commerce-compare @unless ($compare) hidden @endunless>{{ $compare }}</del>
        @endif
        <span class="commerce-price__amount" data-commerce-amount>{{ $variantPrice['price_formatted'] ?? $product->price['formatted'] }}</span>
        @php($taxSuffix = $product->price['taxSuffix'] ?? null)
        @if ($taxSuffix && (! ($hideIncludedTax ?? false) || $taxSuffix !== __('commerce::storefront.price.incl_tax')))
            <small class="commerce-price__tax">{{ $taxSuffix }}</small>
        @endif
    @endif
</div>
