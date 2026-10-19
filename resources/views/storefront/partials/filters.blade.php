{{--
    <x-commerce::product-filter>: a GET form on the current page. $facets, $titles, $prices, $without, $param().
    Each facet is a collapsible group: categories as a tree, colour terms
    (those with a `swatch` hex field) as swatches, other attributes (sizes)
    as boxes in their term order, the rest as checkboxes; then the price
    range, stock and sale, and the sort. With commerce.js it is the filter
    drawer on small screens (data-commerce-filters); without, a plain form.
--}}
@php
    $termIds = collect($facets['terms'])->flatten(1)->pluck('id')->all();
    $termData = $termIds === [] ? collect() : \Sunrice\Models\Term::query()->with('translations')->whereIn('id', $termIds)->get()->keyBy('id');
    $swatchOf = fn (int $id) => ($hex = $termData->get($id)?->translations->first()?->data['swatch'] ?? null) && preg_match('/^#[0-9a-fA-F]{3,8}$/', (string) $hex) ? $hex : null;
    $selectedCount = collect($facets['terms'])->reject(fn ($terms, $taxonomy) => $without !== '' && $param($taxonomy) === $without)->sum(fn ($terms) => collect($terms)->filter(fn ($t) => $t['selected'] === true)->count())
        + (request()->filled('min_price') || request()->filled('max_price') ? 1 : 0) + (request()->boolean('in_stock') ? 1 : 0) + (request()->boolean('on_sale') ? 1 : 0);
@endphp
<form class="commerce-filters" method="GET" action="{{ url()->current() }}" id="commerce-filters" data-commerce-filters aria-labelledby="commerce-filters-title">
    <div class="commerce-filters__head">
        <h2 class="commerce-filters__title" id="commerce-filters-title">{{ __('commerce::storefront.theme.filter') }}@if ($selectedCount > 0) <span class="commerce-filters__badge">{{ $selectedCount }}</span>@endif</h2>
        <button type="button" class="commerce-filters__close" data-commerce-filters-close>
            @include(\Sunrice\Commerce\Storefront\Layout::view('partials.icon'), ['name' => 'close'])
            <span class="commerce-visually-hidden">{{ __('commerce::storefront.cart.close') }}</span>
        </button>
    </div>
    <div class="commerce-filters__body">
        @if (request()->filled('q'))
            <input type="hidden" name="q" value="{{ request('q') }}">
        @endif
        <label class="commerce-filters__sort">
            <span>{{ __('commerce::storefront.listing.sort') }}</span>
            <select name="sort">
                @foreach (\Sunrice\Commerce\Catalog\ProductQuery::SORTS as $sort)
                    @continue(! $prices && str_contains($sort, 'price'))
                    <option value="{{ $sort }}" @selected(request('sort', 'featured') === $sort)>{{ __('commerce::storefront.listing.sorts.'.$sort) }}</option>
                @endforeach
            </select>
        </label>

        @foreach ($facets['terms'] as $taxonomy => $terms)
            @continue($without !== '' && $param($taxonomy) === $without)
            @php
                $name = $param($taxonomy);
                $isSwatches = collect($terms)->contains(fn ($t) => $swatchOf($t['id']) !== null);
                $isBoxes = ! $isSwatches && str_starts_with($name, 'attr[');
                if ($isBoxes) {
                    $terms = collect($terms)->sortBy(fn ($t) => [$termData->get($t['id'])?->sort_order ?? 0, $t['id']])->values()->all();
                }
                // Categories: parents first, each followed by its children in the list.
                $isTree = $name === 'category';
                if ($isTree) {
                    $byParent = collect($terms)->groupBy(fn ($t) => (int) ($termData->get($t['id'])?->parent_id ?? 0));
                    $ids = collect($terms)->pluck('id')->all();
                    $roots = collect($terms)->filter(fn ($t) => ! in_array((int) ($termData->get($t['id'])?->parent_id ?? 0), $ids, true));
                    $terms = $roots->flatMap(fn ($t) => [['depth' => 0, ...$t], ...($byParent->get($t['id']) ?? collect())->map(fn ($c) => ['depth' => 1, ...$c])->all()])->values()->all();
                }
                $title = in_array($name, ['category', 'brand', 'tag'], true) ? __('commerce::storefront.theme.facet_'.$name) : ($titles[$taxonomy] ?? $taxonomy);
                $open = collect($terms)->contains('selected', true) || $loop->index < 3;
            @endphp
            <details class="commerce-filters__group" @if ($open) open @endif>
                <summary>{{ $title }}</summary>
                <fieldset @class(['commerce-filters__options', 'commerce-filters__options--swatches' => $isSwatches, 'commerce-filters__options--boxes' => $isBoxes])>
                    <legend class="commerce-visually-hidden">{{ $title }}</legend>
                    @foreach ($terms as $term)
                        <label @class(['commerce-filters__option', 'commerce-filters__option--child' => ($term['depth'] ?? 0) > 0])>
                            <input type="checkbox" name="{{ $name }}[]" value="{{ $term['id'] }}" @checked($term['selected'])>
                            @if ($isSwatches)
                                <span class="commerce-swatch" style="--swatch: {{ $swatchOf($term['id']) ?? 'transparent' }}" aria-hidden="true"></span>
                            @endif
                            <span class="commerce-filters__name">{{ $term['name'] }}</span>
                            <span class="commerce-filters__count">({{ $term['count'] }})</span>
                        </label>
                    @endforeach
                </fieldset>
            </details>
        @endforeach

        @if ($prices && $facets['price'])
            @php($factor = 10 ** (int) app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('general.currency.decimals', 0))
            <details class="commerce-filters__group commerce-filters__price" @if (request()->filled('min_price') || request()->filled('max_price')) open @endif>
                <summary>{{ __('commerce::storefront.listing.price') }}</summary>
                <fieldset class="commerce-filters__options commerce-filters__range">
                    <legend class="commerce-visually-hidden">{{ __('commerce::storefront.listing.price') }}</legend>
                    <label><span class="commerce-visually-hidden">{{ __('commerce::storefront.listing.min_price') }}</span>
                        <input type="number" name="min_price" value="{{ request('min_price') }}" placeholder="{{ intdiv($facets['price']['min'], $factor) }}" aria-label="{{ __('commerce::storefront.listing.min_price') }}" min="0" inputmode="numeric"></label>
                    <span aria-hidden="true">–</span>
                    <label><span class="commerce-visually-hidden">{{ __('commerce::storefront.listing.max_price') }}</span>
                        <input type="number" name="max_price" value="{{ request('max_price') }}" placeholder="{{ intdiv($facets['price']['max'], $factor) }}" aria-label="{{ __('commerce::storefront.listing.max_price') }}" min="0" inputmode="numeric"></label>
                </fieldset>
            </details>
        @endif
        <fieldset class="commerce-filters__group commerce-filters__toggles">
            <legend class="commerce-visually-hidden">{{ __('commerce::storefront.theme.availability') }}</legend>
            <label class="commerce-filters__option"><input type="checkbox" name="in_stock" value="1" @checked(request()->boolean('in_stock'))> <span>{{ __('commerce::storefront.listing.in_stock') }}</span></label>
            @if ($prices)
                <label class="commerce-filters__option"><input type="checkbox" name="on_sale" value="1" @checked(request()->boolean('on_sale'))> <span>{{ __('commerce::storefront.listing.on_sale') }}</span></label>
            @endif
        </fieldset>
    </div>
    <div class="commerce-filters__foot">
        <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::storefront.listing.apply') }}</button>
        @if (count(request()->except(['page', 'q'])) > 0)
            <a class="commerce-button commerce-button--secondary" href="{{ url()->current() }}{{ request()->filled('q') ? '?q='.urlencode(request('q')) : '' }}">{{ __('commerce::storefront.listing.reset') }}</a>
        @endif
    </div>
</form>
