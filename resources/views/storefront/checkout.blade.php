{{--
    The one-page checkout. $cart (CartView), $state (CalculationState), $data (CheckoutData), $mode (CheckoutMode), $settings,
    $needsAddress, $paymentMethods, $savedAddresses, $loyaltyPoints, $guest, $offerAccount,
    $accountRequired, $extraFields, $termsUrl, $submitLabel.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    <section class="commerce-checkout-page">
        <h1 class="commerce-page-title">{{ __('commerce::checkout.title') }}</h1>
        <ol class="commerce-steps" aria-label="{{ __('commerce::storefront.theme.checkout_steps') }}">
            <li><a href="{{ commerce_url('commerce.cart') }}">{{ __('commerce::storefront.cart.title') }}</a></li>
            <li aria-current="step"><a href="#contact">{{ __('commerce::checkout.sections.contact') }}</a></li>
            @if ($needsAddress)<li><a href="#shipping">{{ __('commerce::checkout.sections.shipping') }}</a></li>@endif
            @if ($mode->payment())
                <li data-commerce-payment-step @if ($state->totals['total'] <= 0) hidden @endif><a href="#payment">{{ __('commerce::checkout.sections.payment') }}</a></li>
            @endif
        </ol>
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
            <div class="commerce-checkout__main">

            <fieldset class="commerce-checkout__section" id="contact">
                <legend>{{ __('commerce::checkout.sections.contact') }}</legend>
                @if ($guest && commerce_feature('accounts'))
                    <p class="commerce-checkout__signin">{{ __('commerce::checkout.have_account') }} <a href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::checkout.sign_in') }}</a></p>
                @endif
                <label class="commerce-field"><span>{{ __('commerce::checkout.fields.email') }} *</span>
                    <input type="email" name="email" value="{{ old('email', $data->email()) }}" required autocomplete="email">
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
                    <div data-commerce-shipping-address>
                        <p class="commerce-muted commerce-checkout__pickup-note" data-commerce-pickup-note @unless ($data->isPickup()) hidden @endunless>{{ __('commerce::checkout.pickup_address') }}</p>
                        @if ($savedAddresses->isNotEmpty())
                            <label class="commerce-field"><span>{{ __('commerce::checkout.saved_address') }}</span>
                                <select name="address_id" data-commerce-saved-address>
                                    <option value="">{{ __('commerce::checkout.new_address') }}</option>
                                    @foreach ($savedAddresses as $saved)
                                        <option value="{{ $saved->id }}" data-address='@json($saved->toAddress())' @selected((int) $data->get('address_id') === $saved->id)>{{ $saved->label ?: $saved->line1 }} · {{ $saved->name }}</option>
                                    @endforeach
                                </select>
                            </label>
                            <button type="submit" name="action" value="use_saved_address" class="commerce-button commerce-button--secondary" data-commerce-address-fallback>{{ __('commerce::checkout.address_picker.use_saved') }}</button>
                        @endif
                        <div class="commerce-checkout-address" data-commerce-address-card hidden>
                            <address data-commerce-address-summary aria-live="polite" hidden></address>
                            <button type="button" class="commerce-link commerce-checkout-address__add" data-commerce-open-address
                                data-add-label="{{ __('commerce::checkout.address_picker.open') }}" data-change-label="{{ __('commerce::checkout.address_picker.edit') }}"
                                aria-haspopup="dialog" aria-controls="checkout-address-dialog">{{ __('commerce::checkout.address_picker.open') }}</button>
                        </div>
                        <div data-commerce-address-editor @if ($errors->has('shipping_address') || $errors->has('shipping_address.*')) data-commerce-address-errors @endif
                            data-phone-required="{{ $settings->get('checkout.require_phone', true) ? '1' : '0' }}"
                            data-postal-required="{{ $settings->get('checkout.require_postal_code', false) ? '1' : '0' }}">
                            @include($L::view('partials.address-fields'), [
                                'prefix' => 'shipping_address', 'address' => $data->shippingAddress() ?? ['name' => $data->get('name'), 'phone' => $data->phone()],
                                'company' => false, 'line2' => (bool) $settings->get('checkout.address_line2', true),
                            ])
                            @unless ($guest)
                                <label class="commerce-check"><input type="checkbox" name="save_address" value="1" @checked($data->get('save_address'))> {{ __('commerce::checkout.save_address') }}</label>
                            @endunless
                        </div>
                        <label class="commerce-check"><input type="checkbox" name="billing_same" value="1" @checked($data->billingSame()) data-commerce-toggle="billing"> {{ __('commerce::checkout.billing_same') }}</label>
                    </div>
                    <div data-commerce-pickup-contact @unless ($data->isPickup()) hidden @endunless>
                        @include($L::view('partials.checkout-contact-fields'), ['contactDefaults' => $data->shippingAddress() ?? []])
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
                </fieldset>
                <x-commerce::slot name="checkout.after_shipping" :state="$state" />
            @else
                <input type="hidden" name="billing_same" value="1">
            @endif

            <input type="hidden" name="use_points" value="0">
            @if ($mode->payment() && ($loyaltyPoints ?? 0) > 0)
                <fieldset class="commerce-checkout__section" id="checkout-points">
                    <legend>{{ __('commerce::checkout.points.title') }}</legend>
                    <p id="checkout-points-balance">{{ __('commerce::storefront.cart.points_balance', ['points' => number_format($loyaltyPoints, 0, ',', '.'), 'value' => $money->format($loyaltyPoints)]) }}</p>
                    <label class="commerce-check">
                        <input type="checkbox" name="use_points" value="1" @checked($data->get('use_points', false)) aria-describedby="checkout-points-balance">
                        {{ __('commerce::storefront.cart.points_use') }}
                    </label>
                    <noscript><button type="submit" name="action" value="update_points" class="commerce-button commerce-button--secondary">{{ __('commerce::checkout.points.update') }}</button></noscript>
                </fieldset>
            @endif

            @if (commerce_feature('vouchers'))
                @include($L::view('partials.checkout-vouchers'))
            @endif

            @if ($mode->payment())
                <fieldset class="commerce-checkout__section" id="payment" data-commerce-payment-section @if ($state->totals['total'] <= 0) hidden @endif>
                    <legend>{{ __('commerce::checkout.sections.payment') }}</legend>
                    @include($L::view('partials.payment-methods'))
                </fieldset>
            @endif
            @if ($mode->payment() && $state->totals['total'] > 0)
                <x-commerce::slot name="checkout.after_payment" :state="$state" />
            @endif

            @if ($settings->get('checkout.order_notes', true))
                <details class="commerce-checkout__notes" id="order-notes" @if (old('notes', $data->get('notes')) || $errors->has('notes')) open @endif>
                    <summary>{{ __('commerce::checkout.fields.notes') }}</summary>
                    <label class="commerce-field">
                        <span class="commerce-visually-hidden">{{ __('commerce::checkout.fields.notes') }}</span>
                        <textarea name="notes" rows="3" maxlength="1000">{{ old('notes', $data->get('notes')) }}</textarea>
                        @include($L::view('partials.field-error'), ['name' => 'notes'])
                    </label>
                </details>
            @endif
            @if ($settings->get('checkout.dropshipper', false) || collect($extraFields)->where('section', 'extra')->isNotEmpty())
                <fieldset class="commerce-checkout__section" id="notes">
                    <legend>{{ __('commerce::checkout.sections.notes') }}</legend>
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

            </div>

            <div class="commerce-checkout__side">
            <aside class="commerce-checkout__summary" id="summary" data-commerce-summary>
                @include($L::view('partials.checkout-summary'))
            </aside>

            <div class="commerce-checkout__place">
            @if (commerce_feature('accounts') && $guest)
                <label class="commerce-check"><input type="checkbox" name="accepts_marketing" value="1" @checked($data->get('accepts_marketing'))> {{ __('commerce::checkout.marketing') }}</label>
            @endif
            @if ($termsUrl)
                <label class="commerce-check"><input type="checkbox" name="terms" value="1" @checked($data->get('terms')) required>
                    {!! __('commerce::checkout.terms', ['link' => '<a href="'.e($termsUrl).'" target="_blank" rel="noopener">'.e(__('commerce::checkout.terms_link')).'</a>']) !!}</label>
                @include($L::view('partials.field-error'), ['name' => 'terms'])
            @endif
            <x-commerce::slot name="checkout.before_submit" />
            @if (filled((string) ($captcha ?? '')))
                <div id="checkout-captcha">@include($L::view('partials.captcha'))</div>
            @endif
            <p role="status" class="commerce-checkout__status" data-commerce-checkout-status
                data-updating="{{ __('commerce::checkout.refresh.updating') }}"
                data-updated="{{ __('commerce::checkout.refresh.updated') }}"
                data-failed="{{ __('commerce::checkout.refresh.failed') }}"
                data-submitting="{{ __('commerce::checkout.refresh.submitting') }}"></p>
            <button type="submit" name="action" value="update" class="commerce-link commerce-checkout__update" data-commerce-update>{{ __('commerce::checkout.refresh.update') }}</button>
            <button type="submit" name="action" value="place" class="commerce-button commerce-button--accent commerce-button--block commerce-checkout__submit">{{ $submitLabel }}</button>
            </div>
            </div>
        </form>
        @if ($needsAddress)
            <dialog id="checkout-address-dialog" class="commerce-checkout-address-dialog" data-commerce-address-dialog aria-labelledby="checkout-address-title">
                <header><h2 id="checkout-address-title" tabindex="-1" autofocus>{{ __('commerce::checkout.address_picker.title') }}</h2></header>
                <div class="commerce-checkout-address-dialog__body" data-commerce-address-dialog-body></div>
                <p class="commerce-field__error commerce-checkout-address-dialog__error" data-commerce-address-dialog-error role="alert" hidden>{{ __('commerce::checkout.address_picker.incomplete') }}</p>
                <footer>
                    <button type="button" class="commerce-button commerce-button--secondary" data-commerce-cancel-address>{{ __('commerce::account.addresses.cancel') }}</button>
                    <button type="button" class="commerce-button commerce-button--primary" data-commerce-apply-address>{{ __('commerce::checkout.address_picker.apply') }}</button>
                </footer>
            </dialog>
        @endif
    </section>
@endsection
