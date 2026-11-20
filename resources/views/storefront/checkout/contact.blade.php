{{-- $data, $settings, $guest, $needsAddress, $offerAccount, $accountRequired, $extraFields. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<fieldset class="commerce-checkout__section" id="contact">
    <legend>{{ __('commerce::checkout.sections.contact') }}</legend>
    @if ($guest && commerce_feature('accounts'))
        <p class="commerce-checkout__signin">{{ __('commerce::checkout.have_account') }} <a href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::checkout.sign_in') }}</a></p>
    @endif
    <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }} *</span>
        <input type="email" name="email" value="{{ $verifiedCheckoutEmail ?? old('email', $data->email()) }}" @readonly(isset($verifiedCheckoutEmail)) required autocomplete="email">
        @include($L::view('partials.field-error'), ['name' => 'email'])
    </label>
    @if ($guest && isset($verifiedCheckoutEmail))
        <p class="commerce-checkout__signin"><a href="{{ commerce_url('commerce.checkout-access', ['change' => 1]) }}">{{ __('commerce::checkout-access.use_another') }}</a></p>
    @endif
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
    @if ($offerAccount)
        @if (! $accountRequired)
            <label class="commerce-check"><input type="checkbox" name="create_account" value="1" @checked(old('create_account', $data->get('create_account'))) data-commerce-toggle="account-password"> {{ __('commerce::checkout.create_account') }}</label>
        @endif
        <label class="commerce-field" data-commerce-toggled="account-password" @if (! $accountRequired && ! $data->get('create_account')) hidden @endif><span>{{ __('commerce::checkout.fields.password') }}</span>
            <input type="password" name="password" autocomplete="new-password" minlength="8">
            @include($L::view('partials.field-error'), ['name' => 'password'])
        </label>
    @endif
    @foreach (collect($extraFields)->where('section', 'contact') as $field)
        @include($L::view('partials.checkout-field'), ['field' => $field])
    @endforeach
</fieldset>
