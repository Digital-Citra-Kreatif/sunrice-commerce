{{--
    One of the customer's orders. $order, $payment, $downloads, $canCancel, $invoiceUrl,
    $returns (return requests) and $returnable (order item id => quantity, or null).
--}}
@extends(\Sunrice\Commerce\Storefront\Layout::view('account.layout'))

@section('commerce-account')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    <a class="commerce-link commerce-link--action commerce-account__back"
       href="{{ commerce_url($order->isQuote() ? 'commerce.account.quotes' : 'commerce.account.orders') }}">
        <span aria-hidden="true">←</span> {{ __('commerce::account.orders.'.($order->isQuote() ? 'back_to_quotes' : 'back_to_orders')) }}
    </a>
    <h1>{{ $order->isQuote() ? __('commerce::checkout.order.quote_title', ['number' => $order->displayNumber()]) : __('commerce::checkout.order.title', ['number' => $order->displayNumber()]) }}</h1>
    <dl class="commerce-order__states">
        <div><dt>{{ __('commerce::checkout.order.status') }}</dt><dd>{{ $S::label($order->status) }}</dd></div>
        @unless ($order->isQuote())
            <div><dt>{{ __('commerce::checkout.order.payment') }}</dt><dd>{{ $S::label($order->payment_status, 'payment') }}</dd></div>
        @endunless
        <div><dt>{{ __('commerce::checkout.order.date') }}</dt><dd>{{ $order->placed_at?->translatedFormat('j F Y H:i') }}</dd></div>
    </dl>
    @include($L::view('partials.order-payment'))
    @include($L::view('partials.order-items'), ['order' => $order])
    @foreach ($order->shipments as $shipment)
        <p>{{ __('commerce::checkout.order.shipment', ['courier' => $shipment->courier_name ?? $shipment->courier]) }}
            @if ($shipment->tracking_number) · @if ($shipment->tracking_url)<a href="{{ $shipment->tracking_url }}" target="_blank" rel="noopener">{{ $shipment->tracking_number }}</a>@else{{ $shipment->tracking_number }}@endif @endif</p>
    @endforeach
    <div class="commerce-order__actions">
        <a href="{{ $order->url() }}" class="commerce-button commerce-button--secondary">{{ __('commerce::account.orders.details') }}</a>
        @if (! $order->isQuote() && commerce_feature('cart'))
            <form method="POST" action="{{ commerce_url('commerce.account.orders.again', ['order' => $order->id]) }}">@csrf
                <button type="submit" class="commerce-link commerce-link--action">{{ __('commerce::account.orders.buy_again') }}</button></form>
        @endif
        @if ($canCancel)
            @include($L::view('partials.order-cancel'), ['cancelUrl' => commerce_url('commerce.account.orders.cancel', ['order' => $order->id])])
        @endif
    </div>

    @include($L::view('account.order-returns'))

@endsection
