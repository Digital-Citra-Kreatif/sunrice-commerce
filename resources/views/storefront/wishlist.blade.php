{{--
    The wishlist page. $wishlist, $products: the saved product entries, $shareUrl, $readOnly: someone's shared list.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-wishlist">
        <h1>{{ __('commerce::storefront.wishlist.title') }}</h1>
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.messages'))
        @if ($products->isEmpty())
            <p>{{ __('commerce::storefront.wishlist.empty') }}</p>
        @else
            <div class="commerce-grid">
                @foreach ($products as $entry)
                    <div class="commerce-wishlist__item">
                        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.product-card'), ['entry' => $entry])
                        @unless ($readOnly)
                            <x-commerce::wishlist-button :entry="$entry" />
                        @endunless
                    </div>
                @endforeach
            </div>
            @unless ($readOnly)
                <form method="POST" action="{{ commerce_url('commerce.wishlist.share') }}" class="commerce-wishlist__share">
                    @csrf
                    <input type="hidden" name="on" value="{{ $shareUrl ? 0 : 1 }}">
                    <button type="submit">{{ $shareUrl ? __('commerce::storefront.wishlist.stop_sharing') : __('commerce::storefront.wishlist.share') }}</button>
                </form>
                @if ($shareUrl)
                    <p>{{ __('commerce::storefront.wishlist.share_link') }} <input type="text" readonly value="{{ $shareUrl }}" onclick="this.select()"></p>
                @endif
            @endunless
        @endif
    </section>
@endsection
