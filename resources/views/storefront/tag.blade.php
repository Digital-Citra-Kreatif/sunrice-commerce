{{-- A product tag page when the app has no template of its own. $term: the tag. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-term commerce-tag">
        <h1>{{ $term->name }}</h1>
        @php($query = \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->tag($term->id))
        <x-commerce::product-filter :query="$query" without="tag" />
        <x-commerce::products :query="$query" />
    </section>
@endsection
