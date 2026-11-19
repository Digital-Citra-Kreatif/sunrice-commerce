{{-- $order, $invoiceUrl, $canCancel, $accountRequested, $invite, and $registerUrl. --}}
@php($S = \Sunrice\Commerce\Orders\OrderStatus::class)
<aside class="commerce-order__side">
    <dl class="commerce-order__states">
        <div><dt>{{ __('commerce::checkout.order.status') }}</dt><dd><span class="commerce-status commerce-status--{{ $order->status }}">{{ $S::label($order->status) }}</span></dd></div>
        @unless ($order->isQuote())
            <div><dt>{{ __('commerce::checkout.order.payment') }}</dt><dd>{{ $order->payment_method === 'whatsapp' ? $order->payment_method_title : $S::label($order->payment_status, 'payment') }}@if ($order->payment_method_title && $order->payment_method !== 'whatsapp')<span class="commerce-muted"> · {{ $order->payment_method_title }}</span>@endif</dd></div>
            @if ($order->needsShipping())<div><dt>{{ __('commerce::checkout.order.fulfillment') }}</dt><dd>{{ $S::label($order->fulfillment_status, 'fulfillment') }}</dd></div>@endif
        @endunless
        <div><dt>{{ __('commerce::checkout.order.date') }}</dt><dd>{{ $order->placed_at?->translatedFormat('j F Y H:i') }}</dd></div>
    </dl>

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

    <div class="commerce-order__actions">
        @if ($invoiceUrl ?? null)
            <a href="{{ $invoiceUrl }}" target="_blank" rel="noopener" class="commerce-button commerce-button--secondary">{{ __('commerce::documents.download') }}</a>
        @endif
        @if ($canCancel ?? false)
            <form method="POST" action="{{ commerce_url('commerce.order.cancel', ['key' => $order->order_key]) }}" class="commerce-order__cancel"
                onsubmit="return confirm(@js(__('commerce::checkout.order.cancel_confirm')))">
                @csrf
                <button type="submit" class="commerce-link commerce-link--action">{{ __('commerce::checkout.order.cancel') }}</button>
            </form>
        @endif
    </div>

    @if ($accountRequested ?? false)
        <p class="commerce-order__invite">{{ __('commerce::checkout.order.account_verification') }}
            <a href="{{ commerce_url('commerce.account.login') }}">{{ __('commerce::checkout.order.account_sign_in') }}</a>
        </p>
    @elseif ($invite && $registerUrl)
        <p class="commerce-order__invite">{{ __('commerce::checkout.order.invite') }} <a href="{{ $registerUrl }}">{{ __('commerce::checkout.order.create_account') }}</a></p>
    @endif
</aside>
