@php($c = $context['confirmation'] ?? null)
@if ($c)
- {{ __('commerce::payments.confirm.sender_name') }}: {{ $c->sender_name }}@if ($c->sender_bank) ({{ $c->sender_bank }})@endif

- {{ __('commerce::payments.confirm.amount') }}: **{{ app(\Sunrice\Commerce\Support\MoneyFormatter::class)->format($c->amount) }}** / {{ app(\Sunrice\Commerce\Support\MoneyFormatter::class)->format($order->total) }}
@endif
