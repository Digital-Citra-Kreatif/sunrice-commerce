{{--
    The filters in use as chips above a listing, each a link that removes
    it, plus "Clear filters". $query (Catalog\ProductQuery), $without (the
    page's own facet, e.g. "category" on a category page).
--}}
@php
    $filter = new \Sunrice\Commerce\View\Components\ProductFilter($query, $without ?? '');
    $params = request()->except('page');
    $remove = function (string $key, mixed $value = null) use ($params): string {
        $next = $params;
        if ($value === null) {
            \Illuminate\Support\Arr::forget($next, $key);
        } else {
            $kept = array_values(array_filter((array) data_get($next, $key, []), fn ($v) => (string) $v !== (string) $value));
            $kept === [] ? \Illuminate\Support\Arr::forget($next, $key) : data_set($next, $key, $kept);
        }
        $next = array_filter($next, fn ($v) => $v !== [] && $v !== null && $v !== '');

        return url()->current().($next === [] ? '' : '?'.http_build_query($next));
    };
    $chips = [];
    foreach ($filter->facets['terms'] as $taxonomy => $terms) {
        $key = str_replace(['[', ']'], ['.', ''], $filter->param($taxonomy));
        if (($without ?? '') !== '' && $filter->param($taxonomy) === $without) {
            continue;
        }
        foreach ($terms as $term) {
            if ($term['selected']) {
                $chips[] = ['label' => $term['name'], 'url' => $remove($key, $term['id'])];
            }
        }
    }
    $money = app(\Sunrice\Commerce\Support\MoneyFormatter::class);
    $factor = 10 ** (int) app(\Sunrice\Commerce\Settings\StoreSettings::class)->get('general.currency.decimals', 0);
    if (request()->filled('min_price')) {
        $chips[] = ['label' => '≥ '.$money->format((int) request('min_price') * $factor), 'url' => $remove('min_price')];
    }
    if (request()->filled('max_price')) {
        $chips[] = ['label' => '≤ '.$money->format((int) request('max_price') * $factor), 'url' => $remove('max_price')];
    }
    if (request()->boolean('in_stock')) {
        $chips[] = ['label' => __('commerce::storefront.listing.in_stock'), 'url' => $remove('in_stock')];
    }
    if (request()->boolean('on_sale')) {
        $chips[] = ['label' => __('commerce::storefront.listing.on_sale'), 'url' => $remove('on_sale')];
    }
@endphp
@if ($chips !== [])
    <ul class="commerce-chips" aria-label="{{ __('commerce::storefront.theme.active_filters') }}">
        @foreach ($chips as $chip)
            <li><a class="commerce-chip" href="{{ $chip['url'] }}">{{ $chip['label'] }} <span aria-hidden="true">×</span><span class="commerce-visually-hidden">{{ __('commerce::storefront.cart.remove') }}</span></a></li>
        @endforeach
        <li><a class="commerce-chips__clear" href="{{ url()->current() }}{{ request()->filled('q') ? '?q='.urlencode(request('q')) : '' }}">{{ __('commerce::storefront.listing.reset') }}</a></li>
    </ul>
@endif
