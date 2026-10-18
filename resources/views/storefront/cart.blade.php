{{--
    The cart page. $cart: CartView (<x-commerce::cart>).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.assets'))
    <section class="commerce-cart-page">
        <h1>{{ __('commerce::storefront.cart.title') }}</h1>
        <x-commerce::cart :cart="$cart" />
    </section>
@endsection
