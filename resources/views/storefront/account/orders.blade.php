{{--
    My Account → Orders. $orders (paginated), $type: order.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    <h1>{{ $type === 'quote' ? __('commerce::account.orders.quotes') : __('commerce::account.orders.title') }}</h1>
    <x-commerce::slot name="account.overview" :customer="$customer" />
    @isset($orderFilters)
        @include(\Sunrice\Commerce\Storefront\Layout::view('account.order-filters'))
    @endisset
    @if ($orders->isEmpty())
        @php($empty = ($filtersActive ?? false) || $orders->total() > 0 ? 'filters.empty' : ($type === 'quote' ? 'no_quotes' : 'empty'))
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => __('commerce::account.orders.'.$empty), 'icon' => 'bag'])
    @else
        @include(\Sunrice\Commerce\Storefront\Layout::view('account.order-table'))
    @endif
    @if ($orders->hasPages())
        <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">{{ $orders->onEachSide(1)->links(\Sunrice\Commerce\Storefront\Layout::view('partials.pagination')) }}</nav>
    @endif
@endsection
