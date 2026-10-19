{{--
    Variant picker: one radio group per option. Without JavaScript the
    chosen options are posted (options[<option id>] = <value id>) and the
    cart finds the variant; with it, the price, stock and button follow
    the choice, and values no variant can be bought with say "sold out".
    $product: ProductView.
--}}
@php($current = $product->defaultVariant()?->uid)
@php($defaultOptions = collect($product->variants)->firstWhere('uid', $current)['options'] ?? ($product->variants[0]['options'] ?? []))
<div class="commerce-picker" data-commerce-picker="{{ $product->variantsJson() }}">
    <input type="hidden" name="product" value="{{ $product->product->id }}">
    @foreach ($product->options as $option)
        @php($optionModel = $product->product->options->firstWhere('uid', $option['id']))
        @php($swatches = collect($option['values'])->mapWithKeys(fn ($value) => [$value['id'] => $optionModel?->values->firstWhere('uid', $value['id'])?->term?->translations->first()?->data['swatch'] ?? null])
            ->map(fn ($hex) => is_string($hex) && preg_match('/^#[0-9a-fA-F]{3,8}$/', $hex) ? $hex : null))
        @php($isSwatch = $swatches->filter()->isNotEmpty())
        <fieldset @class(['commerce-picker__option', 'commerce-picker__option--swatches' => $isSwatch])>
            <legend>{{ $option['name'] }}</legend>
            <span class="commerce-picker__chosen" data-commerce-chosen aria-hidden="true">{{ collect($option['values'])->firstWhere('id', $defaultOptions[$option['id']] ?? null)['label'] ?? '' }}</span>
            @foreach ($option['values'] as $value)
                @php($buyable = collect($product->variants)->contains(fn ($v) => ($v['options'][$option['id']] ?? null) === $value['id'] && $v['stock'] !== 'out_of_stock'))
                @php($inputId = 'opt-'.$product->product->id.'-'.$option['id'].'-'.$value['id'])
                <span class="commerce-picker__value">
                    <input type="radio" id="{{ $inputId }}" name="options[{{ $option['id'] }}]" value="{{ $value['id'] }}" data-commerce-option="{{ $option['id'] }}" data-label="{{ $value['label'] }}"
                        @checked(($defaultOptions[$option['id']] ?? null) === $value['id']) @if (! $buyable) aria-describedby="{{ $inputId }}-soldout" @endif required>
                    @if ($isSwatch)
                        <label for="{{ $inputId }}" class="commerce-picker__swatch" style="--swatch: {{ $swatches[$value['id']] ?? 'transparent' }}" title="{{ $value['label'] }}"><span class="commerce-visually-hidden">{{ $value['label'] }}</span></label>
                    @else
                        <label for="{{ $inputId }}">{{ $value['label'] }}</label>
                    @endif
                    @if (! $buyable)<span id="{{ $inputId }}-soldout" class="commerce-picker__soldout">{{ __('commerce::storefront.stock.out_of_stock') }}</span>@endif
                </span>
            @endforeach
        </fieldset>
    @endforeach
    <p class="commerce-picker__unavailable" data-commerce-unavailable role="status" aria-live="polite" hidden>{{ __('commerce::storefront.product.unavailable') }}</p>
</div>
@once
    @push('scripts')
        <script>
            document.querySelectorAll('[data-commerce-picker]').forEach(function (picker) {
                var data = JSON.parse(picker.dataset.commercePicker);
                var root = picker.closest('[data-commerce-product]');
                function chosen() {
                    var out = {};
                    data.options.forEach(function (o) {
                        var checked = picker.querySelector('input[data-commerce-option="' + o.id + '"]:checked');
                        out[o.id] = checked ? checked.value : '';
                    });
                    return out;
                }
                function update() {
                    var c = chosen();
                    var match = data.variants.find(function (v) { return Object.keys(c).every(function (k) { return v.options[k] === c[k]; }); });
                    var input = root.querySelector('[data-commerce-variant]');
                    if (input) input.value = match ? match.id : '';
                    var none = picker.querySelector('[data-commerce-unavailable]');
                    none.hidden = !!match || Object.values(c).some(function (v) { return !v; });
                    var amount = root.querySelector('[data-commerce-amount]');
                    if (match && amount && match.price_formatted) amount.textContent = match.price_formatted;
                    var compare = root.querySelector('[data-commerce-compare]');
                    if (compare) compare.hidden = !(match && match.compare_at);
                    if (match && compare && match.compare_at) compare.textContent = match.compare_at;
                    var sku = root.querySelector('[data-commerce-sku]');
                    if (sku && match) sku.textContent = match.sku || '';
                    var button = root.querySelector('button[type=submit]');
                    if (button) button.disabled = !match || match.stock === 'out_of_stock';
                    root.dispatchEvent(new CustomEvent('commerce:variant', { detail: match || null, bubbles: true }));
                }
                picker.addEventListener('change', function (event) {
                    var input = event.target;
                    var chosen = input.closest('fieldset') && input.closest('fieldset').querySelector('[data-commerce-chosen]');
                    if (chosen && input.dataset.label) chosen.textContent = input.dataset.label;
                    update();
                });
                update();
            });
        </script>
    @endpush
@endonce
