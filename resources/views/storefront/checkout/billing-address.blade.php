{{-- $data: the checkout data for billing. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<fieldset class="commerce-checkout__section" data-commerce-toggled="billing" @if ($data->billingSame()) hidden @endif>
    <legend>{{ __('commerce::checkout.sections.billing') }}</legend>
    @include($L::view('partials.address-fields'), ['prefix' => 'billing_address', 'address' => $data->get('billing_address') ?? []])
</fieldset>
