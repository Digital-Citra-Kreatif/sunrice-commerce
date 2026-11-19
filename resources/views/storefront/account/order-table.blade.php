{{-- $orders: a paginator of order or quote models. --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
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
