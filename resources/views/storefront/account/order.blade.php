{{--
    One of the customer's orders. $order, $payment, $downloads, $canCancel, $invoiceUrl,
    $returns (return requests) and $returnable (order item id => quantity, or null).
--}}
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

    @foreach ($returns as $return)
        <p class="commerce-return">{{ __('commerce::account.returns.line', ['number' => $return->number(), 'status' => __('commerce::account.returns.statuses.'.$return->status), 'date' => $return->created_at?->translatedFormat('j F Y')]) }}
            @if ($return->note)<br><small>{{ $return->note }}</small>@endif</p>
    @endforeach
    @if ($returnable !== null)
        @php($lines = $order->items->whereNull('parent_id')->keyBy('id'))
        <details class="commerce-accordion commerce-return-form" @if ($errors->hasAny(['items', 'reason', 'return'])) open @endif>
            <summary>{{ __('commerce::account.returns.request') }}</summary>
            <form method="POST" action="{{ commerce_url('commerce.account.order.return', ['order' => $order->id]) }}">@csrf
                @include($L::view('partials.field-error'), ['name' => 'return'])
                <fieldset class="commerce-field">
                    <legend>{{ __('commerce::account.returns.items') }}</legend>
                    @foreach ($returnable as $itemId => $max)
                        <label for="return-{{ $itemId }}"><span>{{ $lines[$itemId]?->title() }}</span>
                            <input id="return-{{ $itemId }}" type="number" name="items[{{ $itemId }}]" min="0" max="{{ $max }}" value="{{ old('items.'.$itemId, 0) }}" inputmode="numeric">
                            <small>{{ __('commerce::account.returns.of', ['count' => $max]) }}</small></label>
                    @endforeach
                    @include($L::view('partials.field-error'), ['name' => 'items'])
                </fieldset>
                <label class="commerce-field" for="return-reason"><span>{{ __('commerce::account.returns.reason') }}</span>
                    <select id="return-reason" name="reason" required>
                        @foreach (\Sunrice\Commerce\Returns\Models\ReturnRequest::REASONS as $reason)
                            <option value="{{ $reason }}" @selected(old('reason') === $reason)>{{ __('commerce::account.returns.reasons.'.$reason) }}</option>
                        @endforeach
                    </select></label>
                <label class="commerce-field" for="return-details"><span>{{ __('commerce::account.returns.details') }}</span>
                    <textarea id="return-details" name="details" rows="3" maxlength="2000">{{ old('details') }}</textarea></label>
                <button type="submit" class="commerce-button">{{ __('commerce::account.returns.submit') }}</button>
            </form>
        </details>
    @endif
@endsection
