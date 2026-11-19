<label class="commerce-field"><span>{{ __('commerce::checkout.fields.name') }} *</span>
    <input type="text" name="name" value="{{ old('name', $data->get('name')) }}" required autocomplete="name">
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'name'])
</label>
<label class="commerce-field"><span>{{ __('commerce::checkout.fields.phone') }} @if ($settings->get('checkout.require_phone', true))*@endif</span>
    <input type="tel" name="phone" value="{{ old('phone', $data->phone()) }}" @required($settings->get('checkout.require_phone', true)) autocomplete="tel">
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'phone'])
</label>
