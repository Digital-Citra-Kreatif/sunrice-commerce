{{-- Confirmation dialog shared by the cart line removal controls. --}}
<dialog class="commerce-cart__remove-dialog" data-commerce-cart-remove-dialog
    aria-labelledby="commerce-cart-remove-title" aria-describedby="commerce-cart-remove-item">
    <h2 id="commerce-cart-remove-title">{{ __('commerce::storefront.cart.remove_confirm') }}</h2>
    <p id="commerce-cart-remove-item" data-commerce-cart-remove-item></p>
    <form method="dialog" class="commerce-cart__remove-actions">
        <button type="submit" value="cancel" class="commerce-link commerce-link--action" autofocus>{{ __('commerce::storefront.cart.remove_cancel') }}</button>
        <button type="submit" value="remove" class="commerce-button commerce-button--accent">{{ __('commerce::storefront.cart.remove') }}</button>
    </form>
</dialog>
