{{--
    The wishlist page. $wishlist, $products: the saved product entries, $shareUrl, $readOnly: someone's shared list.
    Each product is a card (its heart removes it) with Add to cart, or
    "Choose options" for products with variants.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @include($L::view('partials.assets'))
    <section class="commerce-wishlist">
        <h1 class="commerce-page-title">{{ __('commerce::storefront.wishlist.title') }}
            @if ($products->isNotEmpty())<span class="commerce-page-title__meta">{{ trans_choice('commerce::storefront.theme.products_count', $products->count(), ['count' => $products->count()]) }}</span>@endif
        </h1>
        @include($L::view('partials.messages'))
        @if ($products->isEmpty())
            @include($L::view('partials.empty'), ['title' => __('commerce::storefront.wishlist.empty'), 'text' => __('commerce::storefront.theme.wishlist_empty_text'), 'icon' => 'heart',
                'action' => ['url' => url(\Sunrice\Support\Locales::prefix(app()->getLocale()) ?: '/'), 'label' => __('commerce::storefront.cart.continue')]])
        @else
            <div class="commerce-grid commerce-grid--wide">
                @foreach ($products as $entry)
                    @php($view = commerce_product($entry))
                    <div class="commerce-wishlist__item">
                        @include($L::view('partials.product-card'), ['entry' => $entry])
                        @if ($view?->canAddToCart() && ! $view->isVariable() && commerce_feature('cart') && Route::has('commerce.cart.add'))
                            <form method="POST" action="{{ commerce_url('commerce.cart.add') }}" class="commerce-wishlist__add" data-commerce-add data-commerce-cart-api="{{ Route::has('commerce.api.cart.add') ? commerce_url('commerce.api.cart.add') : '' }}">
                                @csrf <x-honeypot />
                                <input type="hidden" name="variant" value="{{ $view->defaultVariant()?->id }}">
                                <input type="hidden" name="quantity" value="{{ $view->defaultVariant()?->min_qty ?? 1 }}">
                                <button type="submit" class="commerce-button commerce-button--primary commerce-button--block">{{ $view->cta['label'] }}</button>
                            </form>
                        @elseif ($view?->purchasable)
                            <a class="commerce-button commerce-button--secondary commerce-button--block" href="{{ $entry->url }}">{{ __('commerce::storefront.theme.choose_options') }}</a>
                        @endif
                    </div>
                @endforeach
            </div>
            @unless ($readOnly)
                <div class="commerce-wishlist__share">
                    <form method="POST" action="{{ commerce_url('commerce.wishlist.share') }}">
                        @csrf
                        <input type="hidden" name="on" value="{{ $shareUrl ? 0 : 1 }}">
                        <button type="submit" class="commerce-button commerce-button--secondary">{{ $shareUrl ? __('commerce::storefront.wishlist.stop_sharing') : __('commerce::storefront.wishlist.share') }}</button>
                    </form>
                    @if ($shareUrl)
                        <p class="commerce-inline-form">
                            <label class="commerce-visually-hidden" for="commerce-share-link">{{ __('commerce::storefront.wishlist.share_link') }}</label>
                            <input id="commerce-share-link" type="text" readonly value="{{ $shareUrl }}" data-commerce-copy="{{ $shareUrl }}" onclick="this.select()">
                            <button type="button" class="commerce-button commerce-button--secondary" data-commerce-copy-button data-copied="{{ __('commerce::payments.copied') }}">{{ __('commerce::payments.copy') }}</button>
                        </p>
                    @endif
                </div>
            @endunless
        @endif
    </section>
@endsection
