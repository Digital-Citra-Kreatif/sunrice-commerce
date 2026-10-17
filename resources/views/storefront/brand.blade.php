{{-- A product brand page when the app has no template of its own. $term: the brand. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-term commerce-brand">
        @php($logo = $term->get('logo'))
        @if (is_object($logo))
            <img class="commerce-brand__logo" src="{{ $logo->url() }}" alt="{{ $term->name }}">
        @endif
        <h1>{{ $term->name }}</h1>
        @if (filled($description = $term->get('description')))
            <div class="commerce-term__description">{!! $description !!}</div>
        @endif
        @if (filled($website = $term->get('website')))
            <p><a href="{{ $website }}" rel="noopener nofollow" target="_blank">{{ parse_url($website, PHP_URL_HOST) ?: $website }}</a></p>
        @endif
        @php($query = \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->brand($term->id))
        <x-commerce::product-filter :query="$query" without="brand" />
        <x-commerce::products :query="$query" />
    </section>
@endsection
