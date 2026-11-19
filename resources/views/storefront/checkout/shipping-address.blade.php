{{-- $data, $settings, $guest, $savedAddresses, $extraFields. --}}
@php($L = \Sunrice\Commerce\Storefront\Layout::class)
<fieldset class="commerce-checkout__section" id="shipping">
    <legend>{{ __('commerce::checkout.sections.shipping') }}</legend>
    <div data-commerce-shipping-address>
        <p class="commerce-muted commerce-checkout__pickup-note" data-commerce-pickup-note @unless ($data->isPickup()) hidden @endunless>{{ __('commerce::checkout.'.($guest ? 'pickup_address_guest' : 'pickup_address')) }}</p>
        @unless ($guest)
            <label class="commerce-field" data-commerce-saved-address-picker @if ($savedAddresses->isEmpty()) hidden @endif><span>{{ __('commerce::checkout.saved_address') }}</span>
                <select name="address_id" data-commerce-saved-address>
                    <option value="" data-placeholder="{{ __('commerce::checkout.new_address') }}">{{ $data->get('shipping_address.label', __('commerce::checkout.new_address')) }}</option>
                    @foreach ($savedAddresses as $saved)
                        <option value="{{ $saved->id }}" data-address='@json($saved->toAddress())' @selected((int) $data->get('address_id') === $saved->id)>{{ $saved->label ?: $saved->line1 }} · {{ $saved->name }}</option>
                    @endforeach
                </select>
            </label>
            @if ($savedAddresses->isNotEmpty())
                <button type="submit" name="action" value="use_saved_address" class="commerce-button commerce-button--secondary" data-commerce-address-fallback>{{ __('commerce::checkout.address_picker.use_saved') }}</button>
            @endif
        @endunless
        <div @class(['commerce-checkout-address', 'commerce-checkout-address--guest' => $guest]) data-commerce-address-card hidden>
            @if ($guest)
                <p class="commerce-checkout-address__hint">{{ __('commerce::checkout.address_picker.delivery_hint') }}</p>
            @endif
            <address data-commerce-address-summary aria-live="polite" hidden></address>
            <button type="button" class="commerce-link commerce-checkout-address__add" data-commerce-open-address
                data-add-label="{{ __('commerce::checkout.address_picker.open') }}" data-change-label="{{ __('commerce::checkout.address_picker.edit') }}"
                aria-haspopup="dialog" aria-controls="checkout-address-dialog">{{ __('commerce::checkout.address_picker.open') }}</button>
        </div>
        <div data-commerce-address-editor @if ($errors->has('shipping_address') || $errors->has('shipping_address.*')) data-commerce-address-errors @endif
            data-phone-required="{{ $settings->get('checkout.require_phone', true) ? '1' : '0' }}"
            data-postal-required="{{ $settings->get('checkout.require_postal_code', false) ? '1' : '0' }}">
            <label class="commerce-field">
                <span>{{ __('commerce::checkout.address_picker.label') }}</span>
                <input type="text" name="shipping_address[label]" value="{{ $data->get('shipping_address.label') }}"
                    placeholder="{{ __('commerce::checkout.address_picker.label_example') }}" maxlength="60" autocomplete="off">
                @include($L::view('partials.field-error'), ['name' => 'shipping_address.label'])
            </label>
            @include($L::view('partials.address-fields'), [
                'prefix' => 'shipping_address', 'address' => $data->shippingAddress() ?? ['name' => $data->get('name'), 'phone' => $data->phone()],
                'company' => false, 'line2' => (bool) $settings->get('checkout.address_line2', true),
            ])
            @unless ($guest)
                <label class="commerce-check"><input type="checkbox" name="save_address" value="1" @checked($data->get('save_address', ! $data->get('address_id')))> {{ __('commerce::checkout.save_address') }}</label>
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
