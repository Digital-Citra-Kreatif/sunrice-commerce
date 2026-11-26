{{--
    My Account → Quotes (Quotation mode). $orders (paginated), $type: quote.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('commerce-account')
    <h1>{{ $type === 'quote' ? __('commerce::account.orders.quotes') : __('commerce::account.orders.title') }}</h1>
    @if ($orders->isEmpty())
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => $type === 'quote' ? __('commerce::account.orders.no_quotes') : __('commerce::account.orders.empty'), 'icon' => 'bag'])
    @else
        @include(\Sunrice\Commerce\Storefront\Layout::view('account.order-table'))
        <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">{{ $orders->onEachSide(1)->links(\Sunrice\Commerce\Storefront\Layout::view('partials.pagination')) }}</nav>
    @endif
@endsection
