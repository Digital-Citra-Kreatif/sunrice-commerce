<table class="totals" style="width: 50%; margin-left: 50%">
    <tr><td>{{ __('commerce::documents.subtotal') }}</td><td class="num">{{ $money->format($order->subtotal) }}</td></tr>
    @foreach ($order->adjustments->whereIn('kind', ['discount', 'shipping_discount', 'manual']) as $a)
        <tr><td>{{ $a->label }}</td><td class="num">-{{ $money->format(abs($a->amount)) }}</td></tr>
    @endforeach
    @if ($order->shipping_method)<tr><td>{{ __('commerce::documents.shipping') }}</td><td class="num">{{ $money->format($order->shipping_total) }}</td></tr>@endif
    @foreach ($order->adjustments->whereIn('kind', ['fee', 'unique_code']) as $a)
        <tr><td>{{ $a->label }}</td><td class="num">{{ $money->format($a->amount) }}</td></tr>
    @endforeach
    @foreach ($order->adjustments->where('kind', 'tax') as $a)
        <tr><td>{{ $a->label }}{{ ($a->meta['included'] ?? false) ? ' ('.__('commerce::documents.included').')' : '' }}</td><td class="num">{{ $money->format($a->amount) }}</td></tr>
    @endforeach
    <tr class="total"><td>{{ __('commerce::documents.total') }}</td><td class="num">{{ $money->format($order->total) }}</td></tr>
    @if ($order->paid_total > 0)<tr><td>{{ __('commerce::documents.paid') }}</td><td class="num">{{ $money->format($order->paid_total) }}</td></tr>@endif
    @if ($order->refunded_total > 0)<tr><td>{{ __('commerce::documents.refunded') }}</td><td class="num">-{{ $money->format($order->refunded_total) }}</td></tr>@endif
</table>
