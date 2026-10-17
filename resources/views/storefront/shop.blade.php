{{-- The shop page (the product collection's listing) when the app has no template of its own. --}}
@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    <section class="commerce-shop">
        <h1>{{ $collection->title ?? __('commerce::storefront.listing.shop') }}</h1>
        <form class="commerce-search" method="GET" action="{{ url()->current() }}" role="search">
            <input type="search" name="q" value="{{ request('q') }}" placeholder="{{ __('commerce::storefront.listing.search') }}" aria-label="{{ __('commerce::storefront.listing.search') }}">
        </form>
        <x-commerce::products :filters="true" />
    </section>
@endsection
