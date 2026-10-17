{{-- An order's lines and totals. $order --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<table class="commerce-order__items">
    <tbody>
        @foreach ($order->items->whereNull('parent_id') as $item)
            <tr>
                <td>{{ $item->title() }}
                    @if ($item->children->isNotEmpty())
                        <ul class="commerce-order__components">@foreach ($item->children as $child)<li>{{ $child->quantity }} × {{ $child->title() }}</li>@endforeach</ul>
                    @endif
                </td>
                <td>{{ $item->quantity }} × {{ $money->format($item->unit_price) }}</td>
                <td>{{ $money->format($item->subtotal) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
<dl class="commerce-totals">
    <div><dt>{{ __('commerce::storefront.cart.subtotal') }}</dt><dd>{{ $money->format($order->subtotal) }}</dd></div>
    @foreach ($order->adjustments->whereIn('kind', ['discount', 'shipping_discount', 'manual']) as $adjustment)
        <div class="commerce-totals__discount"><dt>{{ $adjustment->label }}</dt><dd>{{ $adjustment->amount < 0 ? '-' : '' }}{{ $money->format(abs($adjustment->amount)) }}</dd></div>
    @endforeach
    @if ($order->needsShipping() && $order->shipping_method)
        <div><dt>{{ __('commerce::storefront.cart.shipping') }}</dt><dd>{{ $money->format($order->shipping_total) }}</dd></div>
    @endif
    @foreach ($order->adjustments->whereIn('kind', ['fee', 'unique_code']) as $adjustment)
        <div><dt>{{ $adjustment->label }}</dt><dd>{{ $money->format($adjustment->amount) }}</dd></div>
    @endforeach
    @if ($order->tax_total > 0)
        <div><dt>{{ __('commerce::storefront.cart.tax') }}</dt><dd>{{ $order->prices_include_tax ? __('commerce::storefront.cart.tax_included', ['amount' => $money->format($order->tax_total)]) : $money->format($order->tax_total) }}</dd></div>
    @endif
    <div class="commerce-totals__total"><dt>{{ __('commerce::storefront.cart.total') }}</dt><dd>{{ $money->format($order->total) }}</dd></div>
</dl>
