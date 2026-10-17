{{--
    Product page fallback (used when the app has no sunrice/products/show
    template). Publish and customize: php artisan commerce:install --templates
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@php($product = commerce_product($entry))

@push('head')
    @if ($product)
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.structured-data'))
    @endif
@endpush

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <article class="commerce-product">
        @php($variantImages = $product ? collect($product->variants)->filter(fn ($v) => $v['image'])->mapWithKeys(fn ($v) => [$v['id'] => \Sunrice\Models\Asset::query()->find($v['image'])?->url()])->filter()->all() : [])
        <div class="commerce-product__gallery" data-commerce-gallery="{{ json_encode($variantImages, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) }}">
            @foreach ((array) ($entry->get('gallery') ?? []) as $image)
                @if (is_object($image))
                    <img src="{{ $image->url() }}" alt="{{ $image->alt ?? $entry->title }}" loading="{{ $loop->first ? 'eager' : 'lazy' }}">
                @endif
            @endforeach
        </div>
        <div class="commerce-product__summary">
            <h1>{{ $entry->title }}</h1>
            @if (filled($entry->get('excerpt')))
                <p class="commerce-product__excerpt">{{ $entry->get('excerpt') }}</p>
            @endif
            <x-commerce::product :entry="$entry" />
            <div class="commerce-product__actions">
                <x-commerce::wishlist-button :entry="$entry" />
                <x-commerce::compare-button :entry="$entry" />
            </div>
            <x-commerce::slot name="product.after-buy" :entry="$entry" />
        </div>
        <div class="commerce-product__details">
            @if (filled($entry->get('description')))
                <div class="commerce-product__description">{!! $entry->get('description') !!}</div>
            @endif
            @if (filled($specs = $entry->get('specifications')))
                <h2>{{ __('commerce::storefront.product.specifications') }}</h2>
                <dl class="commerce-specs">
                    @foreach ($specs as $row)
                        <dt>{{ data_get($row, 'label') }}</dt><dd>{{ data_get($row, 'value') }}</dd>
                    @endforeach
                </dl>
            @endif
            @if (filled($guide = $entry->get('size_guide')))
                <details class="commerce-size-guide"><summary>{{ __('commerce::storefront.product.size_guide') }}</summary>{!! $guide !!}</details>
            @endif
            @if (filled($faq = $entry->get('faq')))
                <h2>{{ __('commerce::storefront.product.faq') }}</h2>
                @foreach ($faq as $row)
                    <details class="commerce-faq"><summary>{{ data_get($row, 'question') }}</summary><p>{{ data_get($row, 'answer') }}</p></details>
                @endforeach
            @endif
        </div>
        @if ($product && $product->cta['type'] === 'inquiry' && \Sunrice\Models\Form::query()->where('handle', config('commerce.catalog.inquiry_form'))->exists())
            <section class="commerce-inquiry" id="inquiry">
                <h2>{{ __('commerce::storefront.product.inquiry') }}</h2>
                @include(\Sunrice\Commerce\Storefront\Layout::view('partials.inquiry-form'))
            </section>
        @endif
        @php($related = collect($entry->get('related_products') ?? [])->filter())
        @if ($related->isNotEmpty())
            <section class="commerce-related">
                <h2>{{ __('commerce::storefront.product.related') }}</h2>
                <div class="commerce-grid">
                    @foreach ($related as $item)
                        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $item])
                    @endforeach
                </div>
            </section>
        @endif
    </article>
@endsection
