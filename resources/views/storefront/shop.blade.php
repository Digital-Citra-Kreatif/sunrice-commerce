{{--
    The shop page (the product collection's listing) when the app has no
    template of its own, and the product search (?q=): the filters, the
    products and an empty state. $collection.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    @php($search = trim((string) request('q')))
    @php($title = $search !== '' ? __('commerce::storefront.theme.results_for', ['query' => $search]) : ($collection->title ?? __('commerce::storefront.listing.shop')))
    <section class="commerce-shop">
        <header class="commerce-listing__header">
            @include($L::view('partials.breadcrumbs'), ['items' => [
                ['label' => __('commerce::storefront.theme.home'), 'url' => url(\Sunrice\Support\Locales::prefix(app()->getLocale()) ?: '/')],
                ['label' => $collection->title ?? __('commerce::storefront.listing.shop'), 'url' => $search !== '' ? url()->current() : null],
                ...($search !== '' ? [['label' => $title, 'url' => null]] : []),
            ]])
            <h1 class="commerce-listing__title">{{ $title }}</h1>
            <form class="commerce-search" method="GET" action="{{ url()->current() }}" role="search">
                <label class="commerce-visually-hidden" for="commerce-shop-q">{{ __('commerce::storefront.listing.search') }}</label>
                <input id="commerce-shop-q" type="search" name="q" value="{{ request('q') }}" placeholder="{{ __('commerce::storefront.listing.search') }}" aria-label="{{ __('commerce::storefront.listing.search') }}" maxlength="100">
                <button type="submit" class="commerce-button commerce-button--primary">@include($L::view('partials.icon'), ['name' => 'search'])<span class="commerce-visually-hidden">{{ __('commerce::storefront.theme.search') }}</span></button>
            </form>
        </header>
        @include($L::view('partials.listing'), ['query' => \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request()), 'without' => ''])
    </section>
@endsection
