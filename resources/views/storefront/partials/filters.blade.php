{{-- <x-commerce::product-filter>: a GET form on the current page. --}}
<form class="commerce-filters" method="GET" action="{{ url()->current() }}">
    @if (request()->filled('q'))
        <input type="hidden" name="q" value="{{ request('q') }}">
    @endif
    @foreach ($facets['terms'] as $taxonomy => $terms)
        @continue($without !== '' && $param($taxonomy) === $without)
        <fieldset class="commerce-filters__group">
            <legend>{{ $titles[$taxonomy] ?? $taxonomy }}</legend>
            @foreach ($terms as $term)
                <label>
                    <input type="checkbox" name="{{ $param($taxonomy) }}[]" value="{{ $term['id'] }}" @checked($term['selected'])>
                    {{ $term['name'] }} <span class="commerce-filters__count">({{ $term['count'] }})</span>
                </label>
            @endforeach
        </fieldset>
    @endforeach
    @if ($prices && $facets['price'])
        @php($factor = 10 ** (int) app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('general.currency.decimals', 0))
        <fieldset class="commerce-filters__group commerce-filters__price">
            <legend>{{ __('commerce::storefront.listing.price') }}</legend>
            <input type="number" name="min_price" value="{{ request('min_price') }}" placeholder="{{ intdiv($facets['price']['min'], $factor) }}" aria-label="{{ __('commerce::storefront.listing.min_price') }}" min="0">
            <input type="number" name="max_price" value="{{ request('max_price') }}" placeholder="{{ intdiv($facets['price']['max'], $factor) }}" aria-label="{{ __('commerce::storefront.listing.max_price') }}" min="0">
        </fieldset>
    @endif
    <fieldset class="commerce-filters__group">
        <label><input type="checkbox" name="in_stock" value="1" @checked(request()->boolean('in_stock'))> {{ __('commerce::storefront.listing.in_stock') }}</label>
        @if ($prices)
            <label><input type="checkbox" name="on_sale" value="1" @checked(request()->boolean('on_sale'))> {{ __('commerce::storefront.listing.on_sale') }}</label>
        @endif
    </fieldset>
    <label class="commerce-filters__sort">
        <span>{{ __('commerce::storefront.listing.sort') }}</span>
        <select name="sort">
            @foreach (\Sunrice\Commerce\Catalog\ProductQuery::SORTS as $sort)
                @continue(! $prices && str_contains($sort, 'price'))
                <option value="{{ $sort }}" @selected(request('sort', 'featured') === $sort)>{{ __('commerce::storefront.listing.sorts.'.$sort) }}</option>
            @endforeach
        </select>
    </label>
    <button type="submit">{{ __('commerce::storefront.listing.apply') }}</button>
    @if (count(request()->except(['page', 'q'])) > 0)
        <a href="{{ url()->current() }}{{ request()->filled('q') ? '?q='.urlencode(request('q')) : '' }}">{{ __('commerce::storefront.listing.reset') }}</a>
    @endif
</form>
