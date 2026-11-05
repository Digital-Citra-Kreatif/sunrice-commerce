{{--
    Product page fallback (used when the app has no sunrice/products/show
    template). Publish and customize: php artisan commerce:install --templates
    $entry (from Sunrice). Breadcrumbs (category trail); the gallery (main
    image and thumbnails, a swipeable row on phones); the summary: brand,
    title, excerpt, <x-commerce::product> (price, flash sale, bulk prices,
    variant picker, quantity, add to cart, stock), wishlist and compare,
    bundle contents and download details; the details as collapsible
    sections (description, specifications, size guide, questions); the
    inquiry form; reviews (<x-commerce::reviews>); upsells and related products.
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
    @php($terms = $entry->terms)
    @php($category = $terms->first(fn ($t) => $t->taxonomy?->handle === config('commerce.catalog.category_taxonomy')))
    @php($brand = $terms->first(fn ($t) => $t->taxonomy?->handle === config('commerce.catalog.brand_taxonomy')))
    @php($trail = collect())
    @php($node = $category)
    @while ($node !== null && $trail->count() < 5)
        @php($trail->prepend(['label' => $node->title($locale), 'url' => $node->url()]))
        @php($node = $node->parent)
    @endwhile
    @include($L::view('partials.breadcrumbs'), ['items' => [
        ['label' => __('commerce::storefront.theme.home'), 'url' => url(\Sunrice\Cms\Support\Locales::prefix($locale) ?: '/')],
        ...$trail->all(),
        ['label' => $entry->title, 'url' => null],
    ]])
    <article class="commerce-product">
        @php($variantImages = $product ? collect($product->variants)->filter(fn ($v) => $v['image'])->mapWithKeys(fn ($v) => [$v['id'] => \Sunrice\Admin\Media\Media::query()->find($v['image'])?->url()])->filter()->all() : [])
        @php($gallery = collect((commerce_values($entry)['gallery'] ?? null) ?? [])->filter(fn ($image) => is_object($image))->values())
        <div class="commerce-product__gallery" data-commerce-gallery="{{ json_encode($variantImages, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) }}">
            <div class="commerce-gallery__main">
                @foreach ($gallery as $image)
                    <img src="{{ $image->url() }}" alt="{{ $image->altIn() ?? $entry->title }}" loading="{{ $loop->first ? 'eager' : 'lazy' }}" width="600" height="750" id="commerce-image-{{ $loop->index }}" data-commerce-gallery-image>
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
                <p class="commerce-eyebrow"><a href="{{ $brand->url() }}">{{ $brand->title($locale) }}</a></p>
            @endif
            <h1 class="commerce-product__title">{{ $entry->title }}</h1>
            @if ($product && commerce_feature('reviews') && $product->product->rating_count > 0)
                <p class="commerce-rating"><a href="#reviews"><span aria-hidden="true">{{ str_repeat('★', (int) round((float) $product->product->rating_average)).str_repeat('☆', 5 - (int) round((float) $product->product->rating_average)) }}</span>
                    {{ trans_choice('commerce::storefront.reviews.count', $product->product->rating_count, ['count' => $product->product->rating_count]) }}</a></p>
            @endif
            @if (filled((commerce_values($entry)['excerpt'] ?? null)))
                <p class="commerce-product__excerpt">{{ (commerce_values($entry)['excerpt'] ?? null) }}</p>
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
            @if (filled((commerce_values($entry)['description'] ?? null)))
                <details class="commerce-accordion" open>
                    <summary>{{ __('commerce::storefront.theme.description') }}</summary>
                    <div class="commerce-product__description commerce-prose">{!! (commerce_values($entry)['description'] ?? null) !!}</div>
                </details>
            @endif
            @if (filled($specs = (commerce_values($entry)['specifications'] ?? null)))
                <details class="commerce-accordion" open>
                    <summary>{{ __('commerce::storefront.product.specifications') }}</summary>
                    <dl class="commerce-specs">
                        @foreach ($specs as $row)
                            <div><dt>{{ data_get($row, 'label') }}</dt><dd>{{ data_get($row, 'value') }}</dd></div>
                        @endforeach
                    </dl>
                </details>
            @endif
            @if (filled($guide = (commerce_values($entry)['size_guide'] ?? null)))
                <details class="commerce-accordion commerce-size-guide" id="size-guide"><summary>{{ __('commerce::storefront.product.size_guide') }}</summary><div class="commerce-prose">{!! $guide !!}</div></details>
            @endif
            @if (filled($faq = (commerce_values($entry)['faq'] ?? null)))
                <details class="commerce-accordion">
                    <summary>{{ __('commerce::storefront.product.faq') }}</summary>
                    @foreach ($faq as $row)
                        <details class="commerce-faq"><summary>{{ data_get($row, 'question') }}</summary><p>{{ data_get($row, 'answer') }}</p></details>
                    @endforeach
                </details>
            @endif
        </div>
        @if ($product && $product->cta['type'] === 'inquiry' && \Sunrice\Cms\Models\Form::query()->where('handle', config('commerce.catalog.inquiry_form'))->exists())
            <section class="commerce-inquiry" id="inquiry">
                <h2>{{ __('commerce::storefront.product.inquiry') }}</h2>
                @include($L::view('partials.inquiry-form'))
            </section>
        @endif
        <x-commerce::reviews :entry="$entry" />
        @foreach (['upsells' => __('commerce::storefront.theme.upsells'), 'related_products' => __('commerce::storefront.product.related')] as $field => $heading)
            @php($items = collect(commerce_values($entry)[$field] ?? [])->filter())
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
