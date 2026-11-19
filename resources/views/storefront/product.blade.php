{{--
    Product page fallback (used when the app has no sunrice/products/show
    template). Publish and customize: php artisan commerce:install --templates
    $entry (from Sunrice). Breadcrumbs (category trail); the gallery (main
    one image at a time with thumbnails and a lightbox); the summary: brand,
    title, excerpt, <x-commerce::product> (price, flash sale, bulk prices,
    variant picker, quantity, add to cart, stock), wishlist and compare,
    bundle contents and download details; the details as collapsible
    sections (description, specifications, size guide, questions); the
    inquiry form; reviews (<x-commerce::reviews>); upsells and related products.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@php
    $product = commerce_product($entry);
    $projectedProduct = $product && ! \Sunrice\Commerce\Catalog\LiveEntries::previewing($product->entry) ? $product->product : null;
    $gallery = collect((commerce_values($entry)['gallery'] ?? null) ?? [])->filter(fn ($image) => is_object($image))->values();
    $imagesById = $gallery->keyBy('id');
    $variantsWithImages = collect($product?->variants ?? [])->filter(fn ($variant) => $variant['image']);
    $extraImageIds = $variantsWithImages->pluck('image')->unique()->diff($imagesById->keys());
    if ($extraImageIds->isNotEmpty()) {
        $imagesById = $imagesById->union(\Sunrice\Admin\Media\Media::query()->whereKey($extraImageIds->all())->get()->keyBy('id'));
    }
    // Keep gallery order, then append each remaining variant image once in variant order.
    $photoIds = $gallery->pluck('id')->concat($variantsWithImages->pluck('image'))->unique()->values();
    $gallery = $photoIds->map(fn ($id) => $imagesById->get($id))->filter()->values();
    $photoIndexes = $gallery->pluck('id')->flip();
    $variantImages = $variantsWithImages->filter(fn ($variant) => $photoIndexes->has($variant['image']))
        ->mapWithKeys(fn ($variant) => [$variant['id'] => $photoIndexes->get($variant['image'])])->all();
@endphp

@push('head')
    @if ($product)
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.structured-data'))
    @endif
@endpush

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    @php($locale = app()->getLocale())
    @php($content = app(\Sunrice\Commerce\Catalog\ProductContent::class)->forEntry($entry))
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
    @include($L::view('partials.messages'))
    <article class="commerce-product">
        <div class="commerce-product__primary">
            @include($L::view('partials.product-gallery'))
            @include($L::view('partials.product-summary'))
            @include($L::view('partials.product-details'))
        </div>
        @if ($product && $product->cta['type'] === 'inquiry' && \Sunrice\Cms\Models\Form::query()->where('handle', config('commerce.catalog.inquiry_form'))->exists())
            <section class="commerce-inquiry" id="inquiry">
                <h2>{{ __('commerce::storefront.product.inquiry') }}</h2>
                @include($L::view('partials.inquiry-form'))
            </section>
        @endif
        <x-commerce::reviews :entry="$entry" :projected-product="$projectedProduct" />
        @include($L::view('product.upsells'))
        @include($L::view('product.related'))
    </article>
@endsection
