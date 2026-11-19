{{-- The shipping-address dialog shell. The theme script mounts the shipping address editor here. --}}
<dialog id="checkout-address-dialog" class="commerce-checkout-address-dialog" data-commerce-address-dialog aria-labelledby="checkout-address-title">
    <header><h2 id="checkout-address-title" tabindex="-1" autofocus>{{ __('commerce::checkout.address_picker.title') }}</h2></header>
    <div class="commerce-checkout-address-dialog__body" data-commerce-address-dialog-body></div>
    <p class="commerce-field__error commerce-checkout-address-dialog__error" data-commerce-address-dialog-error
        data-incomplete="{{ __('commerce::checkout.address_picker.incomplete') }}" data-save-failed="{{ __('commerce::checkout.address_picker.save_failed') }}" role="alert" hidden></p>
    <footer>
        <button type="button" class="commerce-link commerce-link--action" data-commerce-cancel-address>{{ __('commerce::account.addresses.cancel') }}</button>
        <button type="button" class="commerce-button commerce-button--primary" data-commerce-apply-address>{{ __('commerce::checkout.address_picker.apply') }}</button>
    </footer>
</dialog>
