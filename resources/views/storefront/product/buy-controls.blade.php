{{-- $product, $default and $action: quantity and add-to-cart controls inside the form. --}}
<div class="commerce-add__controls" data-commerce-buy-controls>
    <label class="commerce-add__qty">
        <span>{{ __('commerce::storefront.product.quantity') }}</span>
        <span class="commerce-stepper" data-commerce-stepper>
            <input type="number" name="quantity" value="{{ $default?->minOrderQuantity() ?? 1 }}" min="{{ $default?->minOrderQuantity() ?? 1 }}" step="{{ $default?->qty_step ?? 1 }}" @if ($default?->maxOrderQuantity()) max="{{ $default->maxOrderQuantity() }}" @endif inputmode="numeric" required aria-label="{{ __('commerce::storefront.product.quantity') }}">
        </span>
    </label>
    @if ($action !== null && $product->canAddToCart() && commerce_feature('cart'))
        <button type="submit" class="commerce-add__button">{{ $product->cta['label'] }}</button>
    @elseif ($product->price['signIn'] && Route::has('commerce.account.login'))
        <a class="commerce-add__button" href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::storefront.cta.sign_in_for_price') }}</a>
    @endif
</div>
