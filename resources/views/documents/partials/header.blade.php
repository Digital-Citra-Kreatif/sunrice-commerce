<div class="accent">&nbsp;</div>
<table class="brand">
    <tr>
        <td style="width: 55%">
            @if ($store['logo'])<img src="{{ $store['logo'] }}" alt="" style="max-height: 40px; max-width: 180px"><br>@else<span class="store-name">{{ $store['name'] }}</span><br>@endif
            @if ($store['logo'])<strong>{{ $store['name'] }}</strong><br>@endif
            @if ($store['address'])<span class="muted">{!! nl2br(e($store['address'])) !!}</span><br>@endif
            <span class="muted">@if ($store['phone']){{ $store['phone'] }} @endif @if ($store['email'])· {{ $store['email'] }}@endif</span>
            @if ($store['tax_id'])<br><span class="muted">{{ __('commerce::documents.tax_id') }}: {{ $store['tax_id'] }}</span>@endif
        </td>
        <td style="width: 45%" class="num">
            <h1>{{ $heading }}</h1>
            <table class="meta">
                <tr><td class="num"><strong style="font-size: 12px">{{ $number }}</strong></td></tr>
                <tr><td class="num"><span class="label">{{ __('commerce::documents.date') }}</span><br>{{ ($order->placed_at ?? now())->translatedFormat('j F Y') }}</td></tr>
                @if ($type !== 'quotation' && $order->number)<tr><td class="num"><span class="label">{{ __('commerce::documents.order') }}</span><br>{{ $order->number }}</td></tr>@endif
                @if ($type === 'quotation' && $order->quote_valid_until)<tr><td class="num muted">{{ __('commerce::documents.valid_until', ['date' => $order->quote_valid_until->translatedFormat('j F Y')]) }}</td></tr>@endif
            </table>
        </td>
    </tr>
</table>
<table class="parties">
    <tr>
        <td style="width: 50%">
            <span class="label">{{ __('commerce::documents.bill_to') }}</span><br>
            @if ($order->billing_address){!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($order->billing_address)->format($order->locale))) !!}@else{{ $order->customer_name }}<br>{{ $order->email }}@endif
        </td>
        <td style="width: 50%">
            @if ($order->shipping_address)
                <span class="label">{{ __('commerce::documents.ship_to') }}</span><br>
                {!! nl2br(e(\Sunrice\Commerce\Support\Address::fromArray($order->shipping_address)->format($order->locale))) !!}
            @endif
        </td>
    </tr>
</table>
