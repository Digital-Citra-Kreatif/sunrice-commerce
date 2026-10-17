@extends(\Sunrice\Commerce\Storefront\Layout::name())

@section('content')
    @php($L = \Sunrice\Commerce\Storefront\Layout::class)
    @php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
    @php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
    <section class="commerce-order-page" data-commerce-order="{{ $order->order_key }}">
        @include($L::view('partials.messages'))
        <h1>{{ $order->isQuote() ? __('commerce::checkout.order.quote_title', ['number' => $order->displayNumber()]) : __('commerce::checkout.order.title', ['number' => $order->displayNumber()]) }}</h1>
        <p class="commerce-order__thanks">{{ $order->isQuote() ? __('commerce::checkout.order.quote_thanks') : __('commerce::checkout.order.thanks') }}</p>

        <dl class="commerce-order__states">
            <div><dt>{{ __('commerce::checkout.order.status') }}</dt><dd>{{ $S::label($order->status) }}</dd></div>
            @unless ($order->isQuote())
                <div><dt>{{ __('commerce::checkout.order.payment') }}</dt><dd>{{ $order->payment_method === 'whatsapp' ? $order->payment_method_title : $S::label($order->payment_status, 'payment') }}</dd></div>
                @if ($order->needsShipping())<div><dt>{{ __('commerce::checkout.order.fulfillment') }}</dt><dd>{{ $S::label($order->fulfillment_status, 'fulfillment') }}</dd></div>@endif
            @endunless
            <div><dt>{{ __('commerce::checkout.order.date') }}</dt><dd>{{ $order->placed_at?->translatedFormat('j F Y H:i') }}</dd></div>
        </dl>

        @if ($whatsappUrl)
            <p class="commerce-order__whatsapp">
                <a class="commerce-button commerce-button--whatsapp" href="{{ $whatsappUrl }}" target="_blank" rel="noopener" data-commerce-whatsapp @if ($openWhatsApp) data-open="1" @endif>{{ __('commerce::checkout.order.whatsapp') }}</a>
            </p>
            @if ($openWhatsApp)
                @push('scripts')<script>(function(){var a=document.querySelector('[data-commerce-whatsapp][data-open]');if(a){window.location.href=a.href;}})();</script>@endpush
            @endif
        @endif

        @if ($payment && $order->isUnpaid() && $order->status !== $S::CANCELLED)
            <div class="commerce-order__payment">
                <h2>{{ __('commerce::checkout.order.how_to_pay') }}</h2>
                <p>{{ __('commerce::checkout.order.amount_due', ['amount' => $money->format($payment->amount)]) }}
                    @if ($payment->expires_at) {{ __('commerce::checkout.order.deadline', ['date' => $payment->expires_at->translatedFormat('j F Y H:i')]) }}@endif</p>
                @if ($instructionsView)
                    @include($instructionsView, ['order' => $order, 'payment' => $payment])
                @endif
            </div>
        @endif
        <x-commerce::slot name="order.after_payment" />

        <h2>{{ __('commerce::checkout.order.items') }}</h2>
        @include($L::view('partials.order-items'), ['order' => $order])

        @if ($order->shipping_address)
            <div class="commerce-order__address">
                <h2>{{ __('commerce::checkout.sections.shipping') }}</h2>
                <address>{!! nl2br(e($order->shippingAddress()->format($order->locale))) !!}</address>
                @if ($order->shipping_method)<p>{{ $order->shipping_method['label'] ?? '' }}@if (! empty($order->shipping_method['eta'])) · {{ $order->shipping_method['eta'] }}@endif</p>@endif
            </div>
        @elseif ($order->meta('pickup'))
            <div class="commerce-order__address">
                <h2>{{ __('commerce::checkout.order.pickup') }}</h2>
                <p>{{ $order->meta('pickup.name') }}<br>{{ $order->meta('pickup.address') }}</p>
                @if ($order->meta('pickup.instructions'))<p>{{ $order->meta('pickup.instructions') }}</p>@endif
            </div>
        @endif

        @foreach ($order->shipments as $shipment)
            <div class="commerce-order__shipment">
                <h3>{{ __('commerce::checkout.order.shipment', ['courier' => $shipment->courier_name ?? $shipment->courier]) }}</h3>
                @if ($shipment->tracking_number)
                    <p>{{ __('commerce::checkout.order.tracking') }}:
                        @if ($shipment->tracking_url)<a href="{{ $shipment->tracking_url }}" target="_blank" rel="noopener">{{ $shipment->tracking_number }}</a>@else{{ $shipment->tracking_number }}@endif
                    </p>
                @endif
            </div>
        @endforeach

        @if ($invite && $registerUrl)
            <p class="commerce-order__invite">{{ __('commerce::checkout.order.invite') }} <a href="{{ $registerUrl }}">{{ __('commerce::checkout.order.create_account') }}</a></p>
        @endif
        <x-commerce::slot name="order.after" />
    </section>
@endsection
