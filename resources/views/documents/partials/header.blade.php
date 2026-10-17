<table>
    <tr>
        <td style="width: 55%">
            @if ($store['logo'])<img src="{{ $store['logo'] }}" alt="" style="max-height: 48px; max-width: 200px"><br>@endif
            <strong>{{ $store['name'] }}</strong><br>
            @if ($store['address'])<span class="muted">{!! nl2br(e($store['address'])) !!}</span><br>@endif
            @if ($store['phone']){{ $store['phone'] }} @endif @if ($store['email'])· {{ $store['email'] }}@endif
            @if ($store['tax_id'])<br>{{ __('commerce::documents.tax_id') }}: {{ $store['tax_id'] }}@endif
        </td>
        <td style="width: 45%" class="num">
            <h1>{{ $heading }}</h1>
            <span>{{ $number }}</span><br>
            <span class="muted">{{ __('commerce::documents.date') }}: {{ ($order->placed_at ?? now())->translatedFormat('j F Y') }}</span><br>
            @if ($type !== 'quotation' && $order->number)<span class="muted">{{ __('commerce::documents.order') }}: {{ $order->number }}</span>@endif
            @if ($type === 'quotation' && $order->quote_valid_until)<span class="muted">{{ __('commerce::documents.valid_until', ['date' => $order->quote_valid_until->translatedFormat('j F Y')]) }}</span>@endif
        </td>
    </tr>
</table>
<br>
<table>
    <tr>
        <td style="width: 50%">
            <strong>{{ __('commerce::documents.bill_to') }}</strong><br>
            @if ($order->billing_address){!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($order->billing_address)->format($order->locale))) !!}@else{{ $order->customer_name }}<br>{{ $order->email }}@endif
        </td>
        <td style="width: 50%">
            @if ($order->shipping_address)
                <strong>{{ __('commerce::documents.ship_to') }}</strong><br>
                {!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($order->shipping_address)->format($order->locale))) !!}
            @endif
        </td>
    </tr>
</table>
<br>
