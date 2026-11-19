{{-- $entry, $gallery, $variantImages and $content. --}}
<div class="commerce-product__gallery" data-commerce-gallery="{{ json_encode((object) $variantImages, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) }}">
    @if ($gallery->isNotEmpty())
        <div class="commerce-gallery__stage">
            <div class="commerce-gallery__main">
                @foreach ($gallery as $image)
                    <a href="{{ $image->url() }}" class="commerce-gallery__slide" id="commerce-image-{{ $loop->index }}" data-commerce-gallery-image>
                        <img src="{{ $image->url() }}" alt="{{ $image->altIn() ?: $entry->title }}" loading="{{ $loop->first ? 'eager' : 'lazy' }}" width="600" height="750">
                    </a>
                @endforeach
            </div>
            @if ($gallery->count() > 1)
                <button type="button" class="commerce-gallery__arrow commerce-gallery__arrow--prev" data-commerce-gallery-step="-1" aria-label="{{ __('commerce::storefront.theme.previous') }}" hidden><span aria-hidden="true">‹</span></button>
                <button type="button" class="commerce-gallery__arrow commerce-gallery__arrow--next" data-commerce-gallery-step="1" aria-label="{{ __('commerce::storefront.theme.next') }}" hidden><span aria-hidden="true">›</span></button>
            @endif
        </div>
        @if ($gallery->count() > 1)
            <ul class="commerce-gallery__thumbs" aria-label="{{ __('commerce::storefront.theme.images') }}">
                @foreach ($gallery as $image)
                    <li><a href="#commerce-image-{{ $loop->index }}" data-commerce-thumb="{{ $loop->index }}" @if ($loop->first) aria-current="true" @endif>
                        <img src="{{ $image->url('thumb') }}" alt="{{ __('commerce::storefront.theme.image_n', ['n' => $loop->iteration]) }}" loading="lazy" width="120" height="150"></a></li>
                @endforeach
            </ul>
        @endif
        <dialog class="commerce-gallery__lightbox" data-commerce-gallery-lightbox aria-label="{{ __('commerce::storefront.theme.images') }}">
            <img data-commerce-gallery-zoom alt="">
            <button type="button" class="commerce-gallery__close" data-commerce-gallery-close aria-label="{{ __('commerce::storefront.cart.close') }}" autofocus><span aria-hidden="true">×</span></button>
            @if ($gallery->count() > 1)
                <button type="button" class="commerce-gallery__arrow commerce-gallery__arrow--prev" data-commerce-gallery-step="-1" aria-label="{{ __('commerce::storefront.theme.previous') }}" hidden><span aria-hidden="true">‹</span></button>
                <button type="button" class="commerce-gallery__arrow commerce-gallery__arrow--next" data-commerce-gallery-step="1" aria-label="{{ __('commerce::storefront.theme.next') }}" hidden><span aria-hidden="true">›</span></button>
            @endif
        </dialog>
    @endif
    @if ($video = $content['video'])
        <section class="commerce-product-video" aria-labelledby="product-video-title">
            <h2 id="product-video-title">{{ __('commerce::storefront.product.video') }}</h2>
            @if ($video['type'] === 'youtube')
                <iframe src="{{ $video['url'] }}" title="{{ __('commerce::storefront.product.video') }}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            @elseif ($video['type'] === 'local')
                <video src="{{ $video['url'] }}" controls playsinline preload="metadata" aria-labelledby="product-video-title"></video>
            @else
                <a href="{{ $video['url'] }}" rel="external">{{ __('commerce::storefront.product.watch_video') }}</a>
            @endif
        </section>
    @endif
</div>
