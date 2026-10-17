@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-cart-page">
        <h1>{{ __('commerce::storefront.cart.title') }}</h1>
        <x-commerce::cart :cart="$cart" />
    </section>
@endsection
