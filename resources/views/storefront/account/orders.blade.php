@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    <h1>{{ $type === 'quote' ? __('commerce::account.orders.quotes') : __('commerce::account.orders.title') }}</h1>
    @if ($orders->isEmpty())
        <p>{{ $type === 'quote' ? __('commerce::account.orders.no_quotes') : __('commerce::account.orders.empty') }}</p>
    @else
        <table class="commerce-account__orders">
            <thead><tr>
                <th>{{ __('commerce::account.orders.number') }}</th><th>{{ __('commerce::checkout.order.date') }}</th>
                <th>{{ __('commerce::checkout.order.status') }}</th><th>{{ __('commerce::storefront.cart.total') }}</th>
            </tr></thead>
            <tbody>
                @foreach ($orders as $order)
                    <tr>
                        <td><a href="{{ commerce_url('commerce.account.order', ['order' => $order->id]) }}">{{ $order->displayNumber() }}</a></td>
                        <td>{{ $order->placed_at?->translatedFormat('j M Y') }}</td>
                        <td>{{ $S::label($order->status) }}</td>
                        <td>{{ $money->format($order->total) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        {{ $orders->links() }}
    @endif
@endsection
