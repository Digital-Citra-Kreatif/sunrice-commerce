{{--
    The starter home page. The seeded "Home" page uses it (entry template
    `sunrice.home`; Settings → Site → Homepage points / at it). Sections:
      - the hero: fields hero_title, hero_text, hero_image, hero_button,
        hero_link (blueprint `home`), full width;
      - departments and their categories as tiles (the category taxonomy's
        top terms and their children, with each term's `image`);
      - the running flash sale with its countdown (<x-commerce::flash-sale>);
      - new arrivals and best sellers (<x-commerce::products>);
      - the brands, and the page's `body` text.
    Each section is skipped when it has nothing to show.
--}}
@extends('sunrice.layouts.app')

@php
    $L = \Sunrice\Commerce\Storefront\Layout::class;
    $page = $sunricePage->entry ?? $entry;
    $heroImage = $page->get('hero_image');
    $categoryTaxonomy = \Sunrice\Models\Taxonomy::query()->where('handle', config('commerce.catalog.category_taxonomy', 'product_categories'))->first();
    $departments = $categoryTaxonomy === null ? collect() : \Sunrice\Models\Term::query()->where('taxonomy_id', $categoryTaxonomy->id)->whereNull('parent_id')
        ->with(['translations', 'children.translations'])->orderBy('sort_order')->orderBy('id')->get();
    $categories = $departments->flatMap(fn ($department) => $department->children->sortBy('sort_order'))->take(12);
    $brandTaxonomy = commerce_feature('brands') ? \Sunrice\Models\Taxonomy::query()->where('handle', config('commerce.catalog.brand_taxonomy', 'brands'))->first() : null;
    $brands = $brandTaxonomy === null ? collect() : \Sunrice\Models\Term::query()->where('taxonomy_id', $brandTaxonomy->id)->with('translations')->orderBy('sort_order')->orderBy('id')->limit(12)->get();
    $shop = \Sunrice\Models\Collection::query()->where('handle', (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products'))->first();
    $shopUrl = url($shop !== null ? app(\Sunrice\Frontend\UrlGenerator::class)->archive($shop) : '/products');
@endphp

@section('content')
    @include($L::view('partials.assets'))

    <section class="commerce-hero commerce-bleed" aria-labelledby="commerce-hero-title">
        @if (is_object($heroImage))
            <img class="commerce-hero__image" src="{{ $heroImage->url() }}" alt="{{ $heroImage->alt ?? '' }}" width="1600" height="700" fetchpriority="high">
        @endif
        <div class="commerce-hero__content">
            <p class="commerce-eyebrow">{{ commerce_store_name() }}</p>
            <h1 class="commerce-hero__title" id="commerce-hero-title">{{ $page->get('hero_title') ?: $page->title }}</h1>
            @if (filled($page->get('hero_text')))
                <p class="commerce-hero__text">{{ $page->get('hero_text') }}</p>
            @endif
            <a class="commerce-button commerce-button--accent" href="{{ $page->get('hero_link') ?: $shopUrl }}">{{ $page->get('hero_button') ?: __('commerce::storefront.theme.shop_now') }}</a>
        </div>
    </section>

    @if ($departments->isNotEmpty())
        <section class="commerce-section" aria-labelledby="commerce-departments">
            <h2 class="commerce-section__title" id="commerce-departments">{{ __('commerce::storefront.theme.departments') }}</h2>
            <ul class="commerce-tiles commerce-tiles--large">
                @foreach ($departments->take(4) as $department)
                    @php($image = $department->get('image'))
                    <li class="commerce-tile">
                        <a href="{{ $department->url }}">
                            @if (is_object($image))<img src="{{ $image->url() }}" alt="" loading="lazy" width="600" height="600">@endif
                            <span class="commerce-tile__label">{{ $department->resolveFor(app()->getLocale())->name }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </section>
    @endif

    @if ($categories->isNotEmpty())
        <section class="commerce-section" aria-labelledby="commerce-categories">
            <div class="commerce-section__head">
                <h2 class="commerce-section__title" id="commerce-categories">{{ __('commerce::storefront.theme.categories') }}</h2>
            </div>
            <ul class="commerce-tiles commerce-tiles--small">
                @foreach ($categories as $category)
                    @php($image = $category->get('image'))
                    <li class="commerce-tile">
                        <a href="{{ $category->url }}">
                            @if (is_object($image))<img src="{{ $image->url() }}" alt="" loading="lazy" width="600" height="600">@endif
                            <span class="commerce-tile__label">{{ $category->parent?->resolveFor(app()->getLocale())->name }} · {{ $category->resolveFor(app()->getLocale())->name }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </section>
    @endif

    @if (commerce_feature('flash_sales'))
        <div class="commerce-section commerce-section--flash">
            <x-commerce::flash-sale :limit="5" />
        </div>
    @endif

    <section class="commerce-section" aria-labelledby="commerce-new">
        <div class="commerce-section__head">
            <h2 class="commerce-section__title" id="commerce-new">{{ __('commerce::storefront.theme.new_arrivals') }}</h2>
            <a class="commerce-section__more" href="{{ $shopUrl }}?sort=newest">{{ __('commerce::storefront.theme.view_all') }}</a>
        </div>
        <x-commerce::products sort="newest" :limit="10" :paginate="false" />
    </section>

    <section class="commerce-section" aria-labelledby="commerce-best">
        <div class="commerce-section__head">
            <h2 class="commerce-section__title" id="commerce-best">{{ __('commerce::storefront.theme.best_sellers') }}</h2>
            <a class="commerce-section__more" href="{{ $shopUrl }}?sort=best_selling">{{ __('commerce::storefront.theme.view_all') }}</a>
        </div>
        <x-commerce::products sort="best_selling" :limit="5" :paginate="false" />
    </section>

    @if ($brands->isNotEmpty())
        <section class="commerce-section" aria-labelledby="commerce-brands">
            <div class="commerce-section__head">
                <h2 class="commerce-section__title" id="commerce-brands">{{ __('commerce::storefront.listing.brands') }}</h2>
                @if (Route::has('commerce.brands'))
                    <a class="commerce-section__more" href="{{ commerce_url('commerce.brands') }}">{{ __('commerce::storefront.theme.view_all') }}</a>
                @endif
            </div>
            <ul class="commerce-logos">
                @foreach ($brands as $brand)
                    @php($logo = $brand->get('logo'))
                    <li>
                        <a href="{{ $brand->url }}">
                            @if (is_object($logo))<img src="{{ $logo->url() }}" alt="" loading="lazy" width="200" height="100">@endif
                            <span>{{ $brand->resolveFor(app()->getLocale())->name }}</span>
                        </a>
                    </li>
                @endforeach
            </ul>
        </section>
    @endif

    @if (filled($body = $page->get('body')))
        <section class="commerce-section commerce-prose">{!! $body !!}</section>
    @endif

    <ul class="commerce-promises" aria-label="{{ __('commerce::storefront.theme.promises') }}">
        <li>@include($L::view('partials.icon'), ['name' => 'truck']) <span>{{ __('commerce::storefront.theme.promise_shipping') }}</span></li>
        <li>@include($L::view('partials.icon'), ['name' => 'check']) <span>{{ __('commerce::storefront.theme.promise_exchange') }}</span></li>
        <li>@include($L::view('partials.icon'), ['name' => 'store']) <span>{{ __('commerce::storefront.theme.promise_pickup') }}</span></li>
    </ul>
@endsection
