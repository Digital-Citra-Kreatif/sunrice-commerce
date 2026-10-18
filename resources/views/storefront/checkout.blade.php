{{--
    The one-page checkout. $cart (CartView), $state (CalculationState), $data (CheckoutData), $mode (CheckoutMode), $settings,
    $needsAddress, $paymentMethods, $savedAddresses, $guest, $offerAccount, $accountRequired, $extraFields, $termsUrl, $submitLabel.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    <section class="commerce-checkout-page">
        <h1>{{ __('commerce::checkout.title') }}</h1>
        @include($L::view('partials.messages'))
        @if (session('commerce.changes'))
            <div class="commerce-notice commerce-notice--changed" role="alert">
                <p>{{ __('commerce::checkout.changed_intro') }}</p>
                <ul>@foreach (session('commerce.changes') as $change)<li>{{ $change }}</li>@endforeach</ul>
            </div>
        @endif
        @error('cart')<p class="commerce-message commerce-message--error" role="alert">{{ $message }}</p>@enderror

        <form method="POST" action="{{ commerce_url('commerce.checkout.submit') }}" class="commerce-checkout" data-commerce-checkout data-refresh="{{ commerce_url('commerce.checkout.refresh') }}" novalidate>
            @csrf
            <input type="hidden" name="totals_hash" value="{{ $state->hash() }}" data-commerce-hash>
            <x-commerce::slot name="checkout.before" />

            <fieldset class="commerce-checkout__section" id="contact">
                <legend>{{ __('commerce::checkout.sections.contact') }}</legend>
                @if ($guest && commerce_feature('accounts'))
                    <p class="commerce-checkout__signin">{{ __('commerce::checkout.have_account') }} <a href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::checkout.sign_in') }}</a></p>
                @endif
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.name') }} *</span>
                    <input type="text" name="name" value="{{ old('name', $data->get('name')) }}" required autocomplete="name">
                    @include($L::view('partials.field-error'), ['name' => 'name'])
                </label>
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }} *</span>
                    <input type="email" name="email" value="{{ old('email', $data->email()) }}" required autocomplete="email">
                    @include($L::view('partials.field-error'), ['name' => 'email'])
                </label>
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.phone') }} @if ($settings->get('checkout.require_phone', true))*@endif</span>
                    <input type="tel" name="phone" value="{{ old('phone', $data->phone()) }}" @required($settings->get('checkout.require_phone', true)) autocomplete="tel">
                    @include($L::view('partials.field-error'), ['name' => 'phone'])
                </label>
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
            <x-commerce::slot name="checkout.after_contact" :state="$state" />

            @if ($needsAddress)
                <fieldset class="commerce-checkout__section" id="shipping">
                    <legend>{{ __('commerce::checkout.sections.shipping') }}</legend>
                    @if ($savedAddresses->isNotEmpty())
                        <label class="commerce-field"><span>{{ __('commerce::checkout.saved_address') }}</span>
                            <select name="address_id" data-commerce-saved-address>
                                <option value="">{{ __('commerce::checkout.new_address') }}</option>
                                @foreach ($savedAddresses as $saved)
                                    <option value="{{ $saved->id }}" data-address='@json($saved->toAddress())' @selected((int) $data->get('address_id') === $saved->id)>{{ $saved->label ?: \Sunrice\Commerce\Support\Address::fromArray($saved->toAddress())->format(null, ', ') }}</option>
                                @endforeach
                            </select>
                        </label>
                    @endif
                    <div data-commerce-shipping-address @if ($data->isPickup()) hidden @endif>
                        @include($L::view('partials.address-fields'), [
                            'prefix' => 'shipping_address', 'address' => $data->shippingAddress() ?? [],
                            'company' => false, 'line2' => (bool) $settings->get('checkout.address_line2', true),
                        ])
                        @unless ($guest)
                            <label class="commerce-check"><input type="checkbox" name="save_address" value="1" @checked($data->get('save_address'))> {{ __('commerce::checkout.save_address') }}</label>
                        @endunless
                        <label class="commerce-check"><input type="checkbox" name="billing_same" value="1" @checked($data->billingSame()) data-commerce-toggle="billing"> {{ __('commerce::checkout.billing_same') }}</label>
                    </div>
                    @foreach (collect($extraFields)->where('section', 'shipping') as $field)
                        @include($L::view('partials.checkout-field'), ['field' => $field])
                    @endforeach
                </fieldset>

                <fieldset class="commerce-checkout__section" data-commerce-toggled="billing" @if ($data->billingSame()) hidden @endif>
                    <legend>{{ __('commerce::checkout.sections.billing') }}</legend>
                    @include($L::view('partials.address-fields'), ['prefix' => 'billing_address', 'address' => $data->get('billing_address') ?? []])
                </fieldset>

                <fieldset class="commerce-checkout__section" id="shipping-method">
                    <legend>{{ __('commerce::checkout.sections.shipping_method') }}</legend>
                    @include($L::view('partials.shipping-methods'))
                    <button type="submit" name="action" value="update" class="commerce-button commerce-button--secondary" data-commerce-update>{{ __('commerce::checkout.update_shipping') }}</button>
                </fieldset>
                <x-commerce::slot name="checkout.after_shipping" :state="$state" />
            @else
                <input type="hidden" name="billing_same" value="1">
            @endif

            @if ($mode->payment() && $state->totals['total'] > 0)
                <fieldset class="commerce-checkout__section" id="payment">
                    <legend>{{ __('commerce::checkout.sections.payment') }}</legend>
                    @include($L::view('partials.payment-methods'))
                </fieldset>
                <x-commerce::slot name="checkout.after_payment" :state="$state" />
            @endif

            @if ($settings->get('checkout.order_notes', true) || $settings->get('checkout.dropshipper', false) || collect($extraFields)->where('section', 'extra')->isNotEmpty())
                <fieldset class="commerce-checkout__section" id="notes">
                    <legend>{{ __('commerce::checkout.sections.notes') }}</legend>
                    @if ($settings->get('checkout.order_notes', true))
                        <label class="commerce-field"><span>{{ __('commerce::checkout.fields.notes') }}</span>
                            <textarea name="notes" rows="3" maxlength="1000">{{ old('notes', $data->get('notes')) }}</textarea>
                            @include($L::view('partials.field-error'), ['name' => 'notes'])
                        </label>
                    @endif
                    @if ($settings->get('checkout.dropshipper', false))
                        @php($dropship = $data->dropship())
                        <label class="commerce-check"><input type="checkbox" name="dropship[enabled]" value="1" @checked($dropship['enabled']) data-commerce-toggle="dropship"> {{ __('commerce::checkout.dropship') }}</label>
                        <div data-commerce-toggled="dropship" @if (! $dropship['enabled']) hidden @endif>
                            <label class="commerce-field"><span>{{ __('commerce::checkout.fields.dropship_name') }}</span>
                                <input type="text" name="dropship[name]" value="{{ old('dropship.name', $dropship['name']) }}">
                                @include($L::view('partials.field-error'), ['name' => 'dropship.name'])
                            </label>
                            <label class="commerce-field"><span>{{ __('commerce::checkout.fields.dropship_phone') }}</span>
                                <input type="tel" name="dropship[phone]" value="{{ old('dropship.phone', $dropship['phone']) }}">
                                @include($L::view('partials.field-error'), ['name' => 'dropship.phone'])
                            </label>
                        </div>
                    @endif
                    @foreach (collect($extraFields)->where('section', 'extra') as $field)
                        @include($L::view('partials.checkout-field'), ['field' => $field])
                    @endforeach
                </fieldset>
            @endif

            <aside class="commerce-checkout__summary" id="summary" data-commerce-summary>
                @include($L::view('partials.checkout-summary'))
            </aside>

            @if (commerce_feature('vouchers'))
                <p class="commerce-checkout__voucher"><a href="{{ commerce_url('commerce.cart') }}">{{ __('commerce::checkout.voucher_link') }}</a></p>
            @endif
            @if (commerce_feature('accounts') && $guest)
                <label class="commerce-check"><input type="checkbox" name="accepts_marketing" value="1" @checked($data->get('accepts_marketing'))> {{ __('commerce::checkout.marketing') }}</label>
            @endif
            @if ($termsUrl)
                <label class="commerce-check"><input type="checkbox" name="terms" value="1" @checked($data->get('terms')) required>
                    {!! __('commerce::checkout.terms', ['link' => '<a href="'.e($termsUrl).'" target="_blank" rel="noopener">'.e(__('commerce::checkout.terms_link')).'</a>']) !!}</label>
                @include($L::view('partials.field-error'), ['name' => 'terms'])
            @endif
            <x-commerce::slot name="checkout.before_submit" />
            <button type="submit" name="action" value="place" class="commerce-button commerce-button--primary">{{ $submitLabel }}</button>
        </form>
    </section>
@endsection
