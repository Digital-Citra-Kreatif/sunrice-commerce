{{--
    Product page fallback (used when the app has no sunrice/products/show
    template). Publish and customize: php artisan commerce:install --templates
    $entry (from Sunrice). Breadcrumbs (category trail); the gallery (main
    image and thumbnails, a swipeable row on phones); the summary: brand,
    title, excerpt, <x-commerce::product> (price, flash sale, bulk prices,
    variant picker, quantity, add to cart, stock), wishlist and compare,
    bundle contents and download details; the details as collapsible
    sections (description, specifications, size guide, questions); the
    inquiry form; upsells and related products.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@php($product = commerce_product($entry))

@push('head')
    @if ($product)
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.structured-data'))
    @endif
@endpush

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    @php($locale = app()->getLocale())
    @php($terms = $entry->terms()->with(['translations', 'taxonomy'])->get())
    @php($category = $terms->first(fn ($t) => $t->taxonomy?->handle === config('commerce.catalog.category_taxonomy')))
    @php($brand = $terms->first(fn ($t) => $t->taxonomy?->handle === config('commerce.catalog.brand_taxonomy')))
    @php($trail = collect())
    @php($node = $category)
    @while ($node !== null && $trail->count() < 5)
        @php($trail->prepend(['label' => $node->resolveFor($locale)->name, 'url' => $node->url]))
        @php($node = $node->parent)
    @endwhile
    @include($L::view('partials.breadcrumbs'), ['items' => [
        ['label' => __('commerce::storefront.theme.home'), 'url' => url(\Sunrice\Support\Locales::prefix($locale) ?: '/')],
        ...$trail->all(),
        ['label' => $entry->title, 'url' => null],
    ]])
    <article class="commerce-product">
        @php($variantImages = $product ? collect($product->variants)->filter(fn ($v) => $v['image'])->mapWithKeys(fn ($v) => [$v['id'] => \Sunrice\Models\Asset::query()->find($v['image'])?->url()])->filter()->all() : [])
        @php($gallery = collect($entry->get('gallery') ?? [])->filter(fn ($image) => is_object($image))->values())
        <div class="commerce-product__gallery" data-commerce-gallery="{{ json_encode($variantImages, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) }}">
            <div class="commerce-gallery__main">
                @foreach ($gallery as $image)
                    <img src="{{ $image->url() }}" alt="{{ $image->alt ?? $entry->title }}" loading="{{ $loop->first ? 'eager' : 'lazy' }}" width="600" height="750" id="commerce-image-{{ $loop->index }}" data-commerce-gallery-image>
                @endforeach
            </div>
            @if ($gallery->count() > 1)
                <ul class="commerce-gallery__thumbs" aria-label="{{ __('commerce::storefront.theme.images') }}">
                    @foreach ($gallery as $image)
                        <li><a href="#commerce-image-{{ $loop->index }}" data-commerce-thumb="{{ $loop->index }}" @if ($loop->first) aria-current="true" @endif>
                            <img src="{{ $image->url() }}" alt="{{ __('commerce::storefront.theme.image_n', ['n' => $loop->iteration]) }}" loading="lazy" width="120" height="150"></a></li>
                    @endforeach
                </ul>
            @endif
        </div>
        <div class="commerce-product__summary">
            @if ($brand)
                <p class="commerce-eyebrow"><a href="{{ $brand->url }}">{{ $brand->resolveFor($locale)->name }}</a></p>
            @endif
            <h1 class="commerce-product__title">{{ $entry->title }}</h1>
            @if (filled($entry->get('excerpt')))
                <p class="commerce-product__excerpt">{{ $entry->get('excerpt') }}</p>
            @endif
            <x-commerce::slot name="product.after_summary" :entry="$entry" />
            <x-commerce::slot name="product.before_add_to_cart" :entry="$entry" />
            <x-commerce::product :entry="$entry" />
            <x-commerce::slot name="product.after_add_to_cart" :entry="$entry" />
            <div class="commerce-product__actions">
                <x-commerce::wishlist-button :entry="$entry" />
                <x-commerce::compare-button :entry="$entry" />
            </div>
            @if ($product)
                @include($L::view('partials.product-extras'))
            @endif
        </div>
        <div class="commerce-product__details">
            @if (filled($entry->get('description')))
                <details class="commerce-accordion" open>
                    <summary>{{ __('commerce::storefront.theme.description') }}</summary>
                    <div class="commerce-product__description commerce-prose">{!! $entry->get('description') !!}</div>
                </details>
            @endif
            @if (filled($specs = $entry->get('specifications')))
                <details class="commerce-accordion" open>
                    <summary>{{ __('commerce::storefront.product.specifications') }}</summary>
                    <dl class="commerce-specs">
                        @foreach ($specs as $row)
                            <div><dt>{{ data_get($row, 'label') }}</dt><dd>{{ data_get($row, 'value') }}</dd></div>
                        @endforeach
                    </dl>
                </details>
            @endif
            @if (filled($guide = $entry->get('size_guide')))
                <details class="commerce-accordion commerce-size-guide" id="size-guide"><summary>{{ __('commerce::storefront.product.size_guide') }}</summary><div class="commerce-prose">{!! $guide !!}</div></details>
            @endif
            @if (filled($faq = $entry->get('faq')))
                <details class="commerce-accordion">
                    <summary>{{ __('commerce::storefront.product.faq') }}</summary>
                    @foreach ($faq as $row)
                        <details class="commerce-faq"><summary>{{ data_get($row, 'question') }}</summary><p>{{ data_get($row, 'answer') }}</p></details>
                    @endforeach
                </details>
            @endif
        </div>
        @if ($product && $product->cta['type'] === 'inquiry' && \Sunrice\Models\Form::query()->where('handle', config('commerce.catalog.inquiry_form'))->exists())
            <section class="commerce-inquiry" id="inquiry">
                <h2>{{ __('commerce::storefront.product.inquiry') }}</h2>
                @include($L::view('partials.inquiry-form'))
            </section>
        @endif
        @foreach (['upsells' => __('commerce::storefront.theme.upsells'), 'related_products' => __('commerce::storefront.product.related')] as $field => $heading)
            @php($items = collect($entry->get($field) ?? [])->filter())
            @if ($items->isNotEmpty())
                <section @class(['commerce-related', 'commerce-related--'.$field])>
                    <h2 class="commerce-section__title">{{ $heading }}</h2>
                    <div class="commerce-grid commerce-grid--wide">
                        @foreach ($items->take(5) as $item)
                            @include($L::view('partials.product-card'), ['entry' => $item])
                        @endforeach
                    </div>
                </section>
            @endif
        @endforeach
    </article>
@endsection
