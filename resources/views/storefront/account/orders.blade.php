{{--
    My Account → Orders. $orders (paginated), $type: order.
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    <h1>{{ $type === 'quote' ? __('commerce::account.orders.quotes') : __('commerce::account.orders.title') }}</h1>
    @if ($orders->isEmpty())
        @include(\Sunrice\Commerce\Storefront\Layout::view('partials.empty'), ['title' => $type === 'quote' ? __('commerce::account.orders.no_quotes') : __('commerce::account.orders.empty'), 'icon' => 'bag'])
    @else
        <table class="commerce-account__orders">
            <thead><tr>
                <th>{{ __('commerce::account.orders.number') }}</th><th>{{ __('commerce::checkout.order.date') }}</th>
                <th>{{ __('commerce::checkout.order.status') }}</th><th>{{ __('commerce::storefront.cart.total') }}</th>
            </tr></thead>
            <tbody>
                @foreach ($orders as $order)
                    <tr>
                        <td data-label="{{ __('commerce::account.orders.number') }}"><a href="{{ commerce_url('commerce.account.order', ['order' => $order->id]) }}">{{ $order->displayNumber() }}</a></td>
                        <td data-label="{{ __('commerce::checkout.order.date') }}">{{ $order->placed_at?->translatedFormat('j M Y') }}</td>
                        <td data-label="{{ __('commerce::checkout.order.status') }}"><span class="commerce-status commerce-status--{{ $order->status }}">{{ $S::label($order->status) }}</span></td>
                        <td data-label="{{ __('commerce::storefront.cart.total') }}">{{ $money->format($order->total) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <nav class="commerce-pagination" aria-label="{{ __('commerce::storefront.listing.pages') }}">{{ $orders->onEachSide(1)->links(\Sunrice\Commerce\Storefront\Layout::view('partials.pagination')) }}</nav>
    @endif
@endsection
