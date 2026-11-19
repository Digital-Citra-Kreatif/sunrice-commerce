{{-- $data and $state: the checkout data and calculation. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<fieldset class="commerce-checkout__section" id="shipping-method">
    <legend>{{ __('commerce::checkout.sections.shipping_method') }}</legend>
    @include($L::view('partials.shipping-methods'))
</fieldset>
