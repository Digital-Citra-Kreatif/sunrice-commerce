{{-- The status is translated here, in the customer's language (the email's), not the staff member's. --}}
**{{ $context['return'] ?? '' }}**: {{ __('commerce::account.returns.statuses.'.($context['status'] ?? '')) }}
@if (filled($context['note'] ?? null))

{{ $context['note'] }}
@endif
