@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<x-mail::message>
# {{ $heading }}

@if ($intro !== '')
{{ $intro }}
@endif

@includeIf('commerce::emails.parts.'.$key)

@if ($order && in_array($key, ['order_received', 'payment_received', 'order_completed', 'order_cancelled', 'quote_received', 'quote_ready', 'payment_link', 'order_updated', 'staff_new_order', 'staff_new_quote', 'staff_order_cancelled'], true))
@include('commerce::emails.parts.summary')
@endif

@if ($action)
<x-mail::button :url="$action['url']">
{{ $action['label'] }}
</x-mail::button>
@endif

{{ $store['name'] }}
</x-mail::message>
