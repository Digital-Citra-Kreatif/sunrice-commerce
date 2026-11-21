@php($cards = (array) ($context['gift_cards'] ?? []))
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<x-mail::panel>
@foreach ($cards as $card)
**{{ $card->formatted() }}** — {{ $money->format($card->value) }}@if ($card->expires_at) ({{ __('commerce::emails.gift_card_issued.redeem_by', ['date' => $card->expires_at->translatedFormat('j F Y')]) }})@endif
@if ($card->recipient_email)<br>{{ __('commerce::emails.gift_card_issued.sent_to', ['who' => $card->recipient_name ? $card->recipient_name.' ('.$card->recipient_email.')' : $card->recipient_email]) }}@endif<br>
@endforeach
</x-mail::panel>

{{ __('commerce::emails.gift_card_issued.how') }}
