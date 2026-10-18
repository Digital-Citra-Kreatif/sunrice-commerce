{{--
    Every store email. $key, $heading, $intro, $action, $order, $store (name, url, logo: image URL or null).
    The colors come from emails/theme.blade.php.
--}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<x-mail::layout>
<x-slot:header>
<x-mail::header :url="$store['url']">
@if ($store['logo'] ?? null)
<img src="{{ $store['logo'] }}" alt="{{ $store['name'] }}" style="max-height: 60px; max-width: 240px; border: 0;">
@else
{{ $store['name'] }}
@endif
</x-mail::header>
</x-slot:header>

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

<x-slot:footer>
<x-mail::footer>
© {{ date('Y') }} {{ $store['name'] }}
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
