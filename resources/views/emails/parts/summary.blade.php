@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<x-mail::table>
| {{ __('commerce::documents.item') }} | {{ __('commerce::documents.qty') }} | {{ __('commerce::documents.amount') }} |
|:--|:-:|--:|
@foreach ($order->items()->whereNull('parent_id')->get() as $item)
| {{ $item->title() }}@foreach ($item->details() as $detail)<br>{{ $detail }}@endforeach | {{ $item->quantity }} | {{ $money->format($item->subtotal) }} |
@endforeach
@if ($order->discount_total > 0)
| {{ __('commerce::documents.subtotal') }} | | {{ $money->format($order->subtotal) }} |
| {{ __('commerce::checkout.manual_discount') }} | | -{{ $money->format($order->discount_total) }} |
@endif
@if ($order->shipping_method)
| {{ __('commerce::documents.shipping') }} ({{ $order->shipping_method['label'] ?? '' }}) | | {{ $money->format($order->shipping_total) }} |
@endif
@foreach ($order->adjustments()->whereIn('kind', ['fee', 'unique_code'])->get() as $a)
| {{ $a->label }} | | {{ $money->format($a->amount) }} |
@endforeach
| **{{ __('commerce::documents.total') }}** | | **{{ $money->format($order->total) }}** |
@if ($order->deposit_total > 0 && $order->balanceDue() > 0)
| {{ __('commerce::payments.paid_so_far') }} | | {{ $money->format($order->paid_total) }} |
| {{ $order->balance_due_at ? __('commerce::payments.balance_due_by', ['date' => $order->balance_due_at->translatedFormat('j F Y')]) : __('commerce::payments.balance_later') }} | | {{ $money->format($order->balanceDue()) }} |
@endif
</x-mail::table>
