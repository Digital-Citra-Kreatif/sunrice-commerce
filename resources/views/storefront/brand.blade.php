{{-- A product brand page when the app has no template of its own. $term: the brand. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    <section class="commerce-term commerce-brand">
        <header class="commerce-listing__header commerce-brand__header">
            @include($L::view('partials.breadcrumbs'), ['items' => [
                ['label' => __('commerce::storefront.theme.home'), 'url' => url(\Sunrice\Support\Locales::prefix(app()->getLocale()) ?: '/')],
                ['label' => __('commerce::storefront.listing.brands'), 'url' => \Illuminate\Support\Facades\Route::has('commerce.brands') ? commerce_url('commerce.brands') : null],
                ['label' => $term->name, 'url' => null],
            ]])
            @php($logo = $term->get('logo'))
            @if (is_object($logo))
                <img class="commerce-brand__logo" src="{{ $logo->url() }}" alt="{{ $term->name }}" width="200" height="100">
            @endif
            <h1 class="commerce-listing__title">{{ $term->name }}</h1>
            @if (filled($description = $term->get('description')))
                <div class="commerce-term__description">{!! $description !!}</div>
            @endif
            @if (filled($website = $term->get('website')))
                <p><a href="{{ $website }}" rel="noopener nofollow" target="_blank">{{ parse_url($website, PHP_URL_HOST) ?: $website }}</a></p>
            @endif
        </header>
        @include($L::view('partials.listing'), ['query' => \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->brand($term->id), 'without' => 'brand'])
    </section>
@endsection
