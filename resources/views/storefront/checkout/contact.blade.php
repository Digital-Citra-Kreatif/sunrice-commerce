{{-- $data (its email is the signed-in account's), $settings, $needsAddress, $extraFields. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<fieldset class="commerce-checkout__section" id="contact">
    <legend>{{ __('commerce::checkout.sections.contact') }}</legend>
    {{-- The order goes to the account that is signed in: its address is shown, not asked. --}}
    <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }}</span>
        <input type="email" name="email" value="{{ $data->email() }}" readonly autocomplete="email">
        @include($L::view('partials.field-error'), ['name' => 'email'])
    </label>
    @unless ($needsAddress)
        @include($L::view('partials.checkout-contact-fields'))
    @endunless
    @if ($settings->get('checkout.company_fields', false))
        <label class="commerce-field"><span>{{ __('commerce::checkout.fields.company') }}</span>
            <input type="text" name="fields[company]" value="{{ old('fields.company', $data->get('fields.company')) }}" autocomplete="organization">
        </label>
        <label class="commerce-field"><span>{{ __('commerce::checkout.fields.tax_id') }}</span>
            <input type="text" name="fields[tax_id]" value="{{ old('fields.tax_id', $data->get('fields.tax_id')) }}">
        </label>
    @endif
    @foreach (collect($extraFields)->where('section', 'contact') as $field)
        @include($L::view('partials.checkout-field'), ['field' => $field])
    @endforeach
</fieldset>
