{{-- A product tag page when the app has no template of its own. $term: the tag. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    <section class="commerce-term commerce-tag">
        <header class="commerce-listing__header">
            @include($L::view('partials.breadcrumbs'), ['items' => [
                ['label' => __('commerce::storefront.theme.home'), 'url' => url(\Sunrice\Cms\Support\Locales::prefix(app()->getLocale()) ?: '/')],
                ['label' => $term->title, 'url' => null],
            ]])
            <h1 class="commerce-listing__title">{{ $term->title }}</h1>
        </header>
        @include($L::view('partials.listing'), ['query' => \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->tag($term->term_id), 'without' => 'tag'])
    </section>
@endsection
