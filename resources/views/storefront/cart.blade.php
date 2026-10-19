{{--
    The cart page. $cart: CartView (<x-commerce::cart>).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-cart-page">
        <h1 class="commerce-page-title">{{ __('commerce::storefront.cart.title') }}
            @unless ($cart->isEmpty())<span class="commerce-page-title__meta">{{ trans_choice('commerce::storefront.cart.items', $cart->count(), ['count' => $cart->count()]) }}</span>@endunless
        </h1>
        <x-commerce::cart :cart="$cart" />
    </section>
@endsection
