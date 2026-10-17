{{--
    Address inputs named {$prefix}[field], with country → province → city →
    district (→ village) selects filled from {api}/regions. $address: current values.
--}}
@php($address = (array) ($address ?? []))
@php($p = $prefix ?? 'address')
@php($dot = str_replace(['[', ']'], ['.', ''], $p))
@php($country = old("{$dot}.country", $address['country'] ?? 'ID'))
@php($withVillage = (bool) ($village ?? app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('checkout.village_level', false)))
<div class="commerce-address" data-commerce-address data-api="{{ commerce_url('commerce.api.regions') }}">
    <label class="commerce-field"><span>{{ __('commerce::account.address.name') }} *</span>
        <input type="text" name="{{ $p }}[name]" value="{{ old("{$dot}.name", $address['name'] ?? '') }}" required autocomplete="name">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => "{$dot}.name"])
    </label>
    <label class="commerce-field"><span>{{ __('commerce::account.address.phone') }} *</span>
        <input type="tel" name="{{ $p }}[phone]" value="{{ old("{$dot}.phone", $address['phone'] ?? '') }}" required autocomplete="tel">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => "{$dot}.phone"])
    </label>
    @if ($company ?? false)
        <label class="commerce-field"><span>{{ __('commerce::account.address.company') }}</span>
            <input type="text" name="{{ $p }}[company]" value="{{ old("{$dot}.company", $address['company'] ?? '') }}" autocomplete="organization">
        </label>
    @endif
    <label class="commerce-field"><span>{{ __('commerce::account.address.country') }}</span>
        <select name="{{ $p }}[country]" data-commerce-country autocomplete="country">
            @foreach (\Sunrice\Commerce\Regions\Countries::options() as $option)
                <option value="{{ $option['value'] }}" @selected($country === $option['value'])>{{ $option['label'] }}</option>
            @endforeach
        </select>
    </label>
    @foreach (['province' => 'province_code', 'city' => 'city_code', 'district' => 'district_code', ...($withVillage ? ['village' => 'village_code'] : [])] as $level => $field)
        @php($value = old("{$dot}.{$field}", $address[$field] ?? ''))
        <label class="commerce-field" data-commerce-region-level="{{ $level }}" @if ($country !== 'ID') hidden @endif>
            <span>{{ __('commerce::account.address.'.$level) }} @if ($level !== 'village')*@endif</span>
            <select name="{{ $p }}[{{ $field }}]" data-commerce-region="{{ $level }}" data-value="{{ $value }}">
                <option value="">{{ __('commerce::account.address.choose') }}</option>
                @if ($value !== '' && ($name = $address[$level] ?? null))
                    <option value="{{ $value }}" selected>{{ $name }}</option>
                @endif
            </select>
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => "{$dot}.{$field}"])
        </label>
    @endforeach
    <label class="commerce-field" data-commerce-abroad @if ($country === 'ID') hidden @endif><span>{{ __('commerce::account.address.city') }} *</span>
        <input type="text" name="{{ $p }}[city]" value="{{ old("{$dot}.city", $country !== 'ID' ? ($address['city'] ?? '') : '') }}" autocomplete="address-level2">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => "{$dot}.city"])
    </label>
    <label class="commerce-field" data-commerce-abroad @if ($country === 'ID') hidden @endif><span>{{ __('commerce::account.address.state') }}</span>
        <input type="text" name="{{ $p }}[state]" value="{{ old("{$dot}.state", $address['state'] ?? '') }}" autocomplete="address-level1">
    </label>
    <label class="commerce-field"><span>{{ __('commerce::account.address.line1') }} *</span>
        <input type="text" name="{{ $p }}[line1]" value="{{ old("{$dot}.line1", $address['line1'] ?? '') }}" required autocomplete="address-line1">
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => "{$dot}.line1"])
    </label>
    @if ($line2 ?? true)
        <label class="commerce-field"><span>{{ __('commerce::account.address.line2') }}</span>
            <input type="text" name="{{ $p }}[line2]" value="{{ old("{$dot}.line2", $address['line2'] ?? '') }}" autocomplete="address-line2">
        </label>
    @endif
    <label class="commerce-field"><span>{{ __('commerce::account.address.postal_code') }}</span>
        <input type="text" name="{{ $p }}[postal_code]" value="{{ old("{$dot}.postal_code", $address['postal_code'] ?? '') }}" autocomplete="postal-code" inputmode="numeric" data-commerce-postal>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => "{$dot}.postal_code"])
    </label>
    <label class="commerce-field"><span>{{ __('commerce::account.address.notes') }}</span>
        <input type="text" name="{{ $p }}[notes]" value="{{ old("{$dot}.notes", $address['notes'] ?? '') }}">
    </label>
</div>
@once
    @push('scripts')
        <script>
            document.querySelectorAll('[data-commerce-address]').forEach(function (box) {
                var api = box.dataset.api;
                var levels = Array.prototype.slice.call(box.querySelectorAll('[data-commerce-region]'));
                var country = box.querySelector('[data-commerce-country]');
                function load(index, parent) {
                    var select = levels[index];
                    if (!select) return;
                    var keep = select.dataset.value;
                    select.disabled = index > 0 && !parent;
                    if (index > 0 && !parent) { select.length = 1; return; }
                    fetch(api + (parent ? '?parent=' + encodeURIComponent(parent) : ''), { headers: { Accept: 'application/json' } })
                        .then(function (r) { return r.json(); })
                        .then(function (json) {
                            select.length = 1;
                            json.data.forEach(function (region) {
                                var option = new Option(region.name, region.code, false, region.code === keep);
                                if (region.postal_code) option.dataset.postal = region.postal_code;
                                select.add(option);
                            });
                            if (select.value) load(index + 1, select.value);
                        });
                }
                levels.forEach(function (select, index) {
                    select.addEventListener('change', function () {
                        for (var i = index + 1; i < levels.length; i++) { levels[i].dataset.value = ''; levels[i].length = 1; }
                        var postal = select.selectedOptions[0] && select.selectedOptions[0].dataset.postal;
                        var postalInput = box.querySelector('[data-commerce-postal]');
                        if (postal && postalInput && !postalInput.value) postalInput.value = postal;
                        load(index + 1, select.value);
                    });
                });
                function toggle() {
                    var id = country.value === 'ID';
                    box.querySelectorAll('[data-commerce-region-level]').forEach(function (el) { el.hidden = !id; });
                    box.querySelectorAll('[data-commerce-abroad]').forEach(function (el) { el.hidden = id; });
                }
                country.addEventListener('change', toggle);
                toggle();
                if (country.value === 'ID') load(0, null);
            });
        </script>
    @endpush
@endonce
