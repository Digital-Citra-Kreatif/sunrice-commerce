{{-- $state, $data and $paymentMethods. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<fieldset class="commerce-checkout__section" id="payment" data-commerce-payment-section @if ($state->totals['total'] <= 0) hidden @endif>
    <legend>{{ __('commerce::checkout.sections.payment') }}</legend>
    @include($L::view('partials.payment-methods'))
</fieldset>
