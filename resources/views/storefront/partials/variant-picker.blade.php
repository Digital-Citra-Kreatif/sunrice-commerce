{{-- Option selects; commerce's script (or the inline one below) picks the matching variant. --}}
<div class="commerce-picker" data-commerce-picker="{{ $product->variantsJson() }}">
    @foreach ($product->options as $option)
        <label class="commerce-picker__option">
            <span>{{ $option['name'] }}</span>
            <select data-commerce-option="{{ $option['id'] }}" required>
                <option value="">{{ __('commerce::storefront.product.choose', ['option' => mb_strtolower($option['name'])]) }}</option>
                @foreach ($option['values'] as $value)
                    <option value="{{ $value['id'] }}" @selected(($product->variants[0]['options'][$option['id']] ?? null) === $value['id'])>{{ $value['label'] }}</option>
                @endforeach
            </select>
        </label>
    @endforeach
    <p class="commerce-picker__unavailable" data-commerce-unavailable hidden>{{ __('commerce::storefront.product.unavailable') }}</p>
</div>
@once
    @push('scripts')
        <script>
            document.querySelectorAll('[data-commerce-picker]').forEach(function (picker) {
                var data = JSON.parse(picker.dataset.commercePicker);
                var root = picker.closest('[data-commerce-product]');
                var selects = picker.querySelectorAll('[data-commerce-option]');
                function update() {
                    var chosen = {};
                    selects.forEach(function (s) { chosen[s.dataset.commerceOption] = s.value; });
                    var match = data.variants.find(function (v) { return Object.keys(chosen).every(function (k) { return v.options[k] === chosen[k]; }); });
                    var input = root.querySelector('[data-commerce-variant]');
                    if (input) input.value = match ? match.id : '';
                    picker.querySelector('[data-commerce-unavailable]').hidden = !!match || Object.values(chosen).some(function (v) { return !v; });
                    var amount = root.querySelector('[data-commerce-amount]');
                    if (match && amount && match.price_formatted) amount.textContent = match.price_formatted;
                    var compare = root.querySelector('[data-commerce-compare]');
                    if (compare) compare.hidden = !(match && match.compare_at);
                    if (match && compare && match.compare_at) compare.textContent = match.compare_at;
                    var button = root.querySelector('button[type=submit]');
                    if (button) button.disabled = !match || match.stock === 'out_of_stock';
                    root.dispatchEvent(new CustomEvent('commerce:variant', { detail: match || null, bubbles: true }));
                }
                selects.forEach(function (s) { s.addEventListener('change', update); });
                update();
            });
        </script>
    @endpush
@endonce
