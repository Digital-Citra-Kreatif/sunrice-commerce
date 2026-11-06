{{-- The code and balance of a gift card staff issued. --}}
{{ __('commerce::emails.gift_card.code') }}: **{{ $context['code'] ?? '' }}**

{{ __('commerce::emails.gift_card.balance') }}: {{ $context['amount'] ?? '' }}
@if (filled($context['expires'] ?? null))

{{ __('commerce::emails.gift_card.expires', ['date' => $context['expires']]) }}
@endif
