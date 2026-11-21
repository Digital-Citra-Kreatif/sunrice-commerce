@php($card = $context['gift_card'] ?? null)
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@if ($card)
@if (filled($context['from'] ?? null))
{{ __('commerce::emails.gift_card_received.from', ['from' => $context['from'], 'value' => $money->format($card->value)]) }}
@endif

@if (filled($card->message))
<x-mail::panel>
“{{ $card->message }}”
</x-mail::panel>
@endif

**{{ __('commerce::emails.gift_card_received.code') }}: {{ $card->formatted() }}**@if ($card->expires_at) ({{ __('commerce::emails.gift_card_issued.redeem_by', ['date' => $card->expires_at->translatedFormat('j F Y')]) }})@endif

{{ __('commerce::emails.gift_card_issued.how') }}
@endif
