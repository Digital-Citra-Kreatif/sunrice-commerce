{{-- $cancelUrl is the cancellation action for the current order view. --}}
<form method="POST" action="{{ $cancelUrl }}" class="commerce-order__cancel" data-commerce-order-cancel>
    @csrf
    <button type="button" class="commerce-link commerce-link--action" data-commerce-open-order-cancel aria-haspopup="dialog" hidden>
        {{ __('commerce::checkout.order.cancel') }}
    </button>
    <details data-commerce-order-cancel-fallback>
        <summary class="commerce-link commerce-link--action">{{ __('commerce::checkout.order.cancel') }}</summary>
        <p>{{ __('commerce::checkout.order.cancel_confirm') }}</p>
        <button type="submit" class="commerce-button commerce-button--accent">{{ __('commerce::checkout.order.cancel') }}</button>
    </details>
    <dialog class="commerce-cart__remove-dialog" data-commerce-order-cancel-dialog aria-labelledby="commerce-order-cancel-title">
        <h2 id="commerce-order-cancel-title">{{ __('commerce::checkout.order.cancel_confirm') }}</h2>
        <div class="commerce-cart__remove-actions commerce-order__cancel-actions">
            <button type="button" class="commerce-link commerce-link--action" data-commerce-keep-order autofocus>{{ __('commerce::checkout.order.keep') }}</button>
            <button type="submit" class="commerce-button commerce-button--accent">{{ __('commerce::checkout.order.cancel') }}</button>
        </div>
    </dialog>
</form>
