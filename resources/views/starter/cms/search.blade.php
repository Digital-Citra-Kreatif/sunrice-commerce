{{--
    Site search (/search?q=…) in the starter look: matching products as
    cards first, then the other pages. $query, $results (a paginator of
    EntryTranslations, their entries and collections loaded), $title,
    $locale. The header's search box goes to the product listing instead,
    with its filters.
--}}
@extends('cms.layout', ['seoTitle' => $title])

@php
    $L = \Sunrice\Commerce\Storefront\Layout::class;
    $productCollections = (array) config('commerce.catalog.collections', ['products']);
    [$products, $others] = $results->getCollection()->partition(fn ($result) => in_array($result->entry?->collection?->handle, $productCollections, true));
@endphp

@section('content')
    @include($L::view('partials.assets'))
    <section class="commerce-search-page">
        <header class="commerce-listing__header">
            <h1 class="commerce-listing__title">{{ $query === '' ? __('sunrice-cms::site.search.title') : __('commerce::storefront.theme.results_for', ['query' => $query]) }}</h1>
            <form class="commerce-search" method="GET" action="{{ url()->current() }}" role="search">
                <label class="commerce-visually-hidden" for="commerce-search-q">{{ __('sunrice-cms::site.search.label') }}</label>
                <input id="commerce-search-q" type="search" name="q" value="{{ $query }}" placeholder="{{ __('commerce::storefront.theme.search_placeholder') }}" maxlength="100">
                <button type="submit" class="commerce-button commerce-button--primary">{{ __('commerce::storefront.theme.search') }}</button>
            </form>
        </header>

        @if ($query === '')
            <p class="commerce-muted">{{ __('commerce::storefront.theme.search_hint') }}</p>
        @elseif ($results->isEmpty())
            @include($L::view('partials.empty'), ['title' => __('commerce::storefront.theme.search_nothing', ['query' => $query]), 'text' => __('commerce::storefront.theme.search_tips')])
        @else
            <p class="commerce-listing__count" role="status">{{ trans_choice('sunrice-cms::site.search.results', $results->total(), ['count' => $results->total(), 'query' => $query]) }}</p>
            @if ($products->isNotEmpty())
                <div class="commerce-grid commerce-grid--wide">
                    @foreach ($products as $product)
                        @include($L::view('partials.product-card'), ['entry' => $product])
                    @endforeach
                </div>
            @endif
            @if ($others->isNotEmpty())
                <ul class="commerce-search-page__results">
                    @foreach ($others as $result)
                        @php($fields = commerce_values($result))
                        <li>
                            <a href="{{ $result->url() }}">{{ $result->title }}</a>
                            <span class="commerce-eyebrow">{{ $result->entry?->collection?->titleIn($locale) }}</span>
                            @if (filled($excerpt = ($fields['excerpt'] ?? null) ?: ($fields['intro'] ?? null)))
                                <p>{{ \Illuminate\Support\Str::limit(strip_tags((string) $excerpt), 180) }}</p>
                            @endif
                        </li>
                    @endforeach
                </ul>
            @endif
            <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">{{ $results->onEachSide(1)->links() }}</nav>
        @endif
    </section>
@endsection
