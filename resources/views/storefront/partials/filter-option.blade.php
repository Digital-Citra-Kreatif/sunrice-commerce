@php($showCount = ! ($branch ?? false) || $name !== 'category')
<label class="commerce-filters__option">
    <input type="checkbox" name="{{ $name }}[]" value="{{ $term['id'] }}" @checked($term['selected'])
        @if ($path) aria-label="{{ $path }}{{ $showCount ? ' ('.$term['count'].')' : '' }}" @endif
        @if ($branch ?? false) data-commerce-filter-parent @endif>
    @if ($isSwatches)
        <span class="commerce-swatch" style="--swatch: {{ $swatchOf($term['id']) ?? 'transparent' }}" aria-hidden="true"></span>
    @endif
    <span class="commerce-filters__name">{{ $label }}</span>
    @if ($showCount)
        <span class="commerce-filters__count">({{ $term['count'] }})</span>
    @endif
</label>
