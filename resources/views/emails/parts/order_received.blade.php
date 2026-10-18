@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($payment = $order?->payments()->where('status', 'pending')->latest('id')->first())
@if ($payment && $payment->instructions)
@php($i = (array) $payment->instructions)
**{{ __('commerce::checkout.order.how_to_pay') }}**: {{ $money->format((int) ($i['amount'] ?? $payment->amount)) }}@if ($payment->expires_at) — {{ __('commerce::checkout.order.deadline', ['date' => $payment->expires_at->translatedFormat('j F Y H:i')]) }}@endif

@foreach ((array) ($i['accounts'] ?? []) as $account)
- {{ $account['bank'] }} **{{ $account['number'] }}** · {{ $account['holder'] }}
@endforeach

@if (! empty($i['instructions']))
{{ $i['instructions'] }}
@endif
@endif
