<label class="commerce-filters__option">
    <input type="checkbox" name="{{ $name }}[]" value="{{ $term['id'] }}" @checked($term['selected'])
        @if ($path) aria-label="{{ $path }} ({{ $term['count'] }})" @endif>
    @if ($isSwatches)
        <span class="commerce-swatch" style="--swatch: {{ $swatchOf($term['id']) ?? 'transparent' }}" aria-hidden="true"></span>
    @endif
    <span class="commerce-filters__name">{{ $label }}</span>
    <span class="commerce-filters__count">({{ $term['count'] }})</span>
</label>
