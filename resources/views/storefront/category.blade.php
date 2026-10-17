{{-- A product category page when the app has no template of its own. $term: the category. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-term commerce-category">
        @php($banner = $term->get('banner'))
        @if (is_object($banner))
            <img class="commerce-term__banner" src="{{ $banner->url() }}" alt="">
        @endif
        <h1>{{ $term->name }}</h1>
        @if (filled($description = $term->get('description')))
            <div class="commerce-term__description">{!! $description !!}</div>
        @endif
        @php($children = $term->children()->with('translations')->get())
        @if ($children->isNotEmpty())
            <ul class="commerce-term__children">
                @foreach ($children as $child)
                    <li><a href="{{ $child->url }}">{{ $child->resolveFor(app()->getLocale())->name }}</a></li>
                @endforeach
            </ul>
        @endif
        @php($query = \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->category($term->id))
        <x-commerce::product-filter :query="$query" without="category" />
        <x-commerce::products :query="$query" />
    </section>
@endsection
