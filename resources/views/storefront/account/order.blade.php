@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('account')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    <h1>{{ $order->isQuote() ? __('commerce::checkout.order.quote_title', ['number' => $order->displayNumber()]) : __('commerce::checkout.order.title', ['number' => $order->displayNumber()]) }}</h1>
    <dl class="commerce-order__states">
        <div><dt>{{ __('commerce::checkout.order.status') }}</dt><dd>{{ $S::label($order->status) }}</dd></div>
        @unless ($order->isQuote())
            <div><dt>{{ __('commerce::checkout.order.payment') }}</dt><dd>{{ $S::label($order->payment_status, 'payment') }}</dd></div>
        @endunless
        <div><dt>{{ __('commerce::checkout.order.date') }}</dt><dd>{{ $order->placed_at?->translatedFormat('j F Y H:i') }}</dd></div>
    </dl>
    @include($L::view('partials.order-items'), ['order' => $order])
    @foreach ($order->shipments as $shipment)
        <p>{{ __('commerce::checkout.order.shipment', ['courier' => $shipment->courier_name ?? $shipment->courier]) }}
            @if ($shipment->tracking_number) · @if ($shipment->tracking_url)<a href="{{ $shipment->tracking_url }}" target="_blank" rel="noopener">{{ $shipment->tracking_number }}</a>@else{{ $shipment->tracking_number }}@endif @endif</p>
    @endforeach
    <div class="commerce-order__actions">
        <a href="{{ $order->url() }}" class="commerce-button commerce-button--secondary">{{ __('commerce::account.orders.details') }}</a>
        @if (! $order->isQuote() && commerce_feature('cart'))
            <form method="POST" action="{{ commerce_url('commerce.account.order.again', ['order' => $order->id]) }}">@csrf
                <button type="submit" class="commerce-button commerce-button--secondary">{{ __('commerce::account.orders.buy_again') }}</button></form>
        @endif
        @if ($canCancel)
            <form method="POST" action="{{ commerce_url('commerce.account.order.cancel', ['order' => $order->id]) }}" onsubmit="return confirm(@js(__('commerce::checkout.order.cancel_confirm')))">@csrf
                <button type="submit" class="commerce-button commerce-button--secondary">{{ __('commerce::checkout.order.cancel') }}</button></form>
        @endif
    </div>
@endsection
