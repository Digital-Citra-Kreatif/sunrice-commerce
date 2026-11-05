{{--
    A product category page when the app has no template of its own. $term: the category.
    Breadcrumbs up the category tree, the banner and description, the
    subcategories as links, then the listing (filters without the category facet).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    @php($locale = app()->getLocale())
    @php($trail = collect())
    @php($parent = $term->term->parent)
    @while ($parent !== null && $trail->count() < 5)
        @php($trail->prepend(['label' => $parent->title($locale), 'url' => $parent->url()]))
        @php($parent = $parent->parent)
    @endwhile
    <section class="commerce-term commerce-category">
        <header class="commerce-listing__header">
            @include($L::view('partials.breadcrumbs'), ['items' => [
                ['label' => __('commerce::storefront.theme.home'), 'url' => url(\Sunrice\Cms\Support\Locales::prefix($locale) ?: '/')],
                ...$trail->all(),
                ['label' => $term->title, 'url' => null],
            ]])
            @php($banner = (commerce_values($term)['banner'] ?? null))
            @if (is_object($banner))
                <img class="commerce-term__banner" src="{{ $banner->url() }}" alt="" width="1600" height="480">
            @endif
            <h1 class="commerce-listing__title">{{ $term->title }}</h1>
            @if (filled($description = (commerce_values($term)['description'] ?? null)))
                <div class="commerce-term__description">{!! $description !!}</div>
            @endif
            @php($children = $term->term->children()->with('translations')->orderBy('sort_order')->get())
            @if ($children->isNotEmpty())
                <ul class="commerce-term__children">
                    @foreach ($children as $child)
                        <li><a href="{{ $child->url() }}">{{ $child->title($locale) }}</a></li>
                    @endforeach
                </ul>
            @endif
        </header>
        @include($L::view('partials.listing'), ['query' => \Sunrice\Commerce\Catalog\ProductQuery::fromRequest(request())->category($term->term_id), 'without' => 'category'])
    </section>
@endsection
