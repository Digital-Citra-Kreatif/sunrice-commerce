{{-- A redirect gateway (Payments\Methods\GatewayMethod): the link back to its payment page. $order, $payment --}}
@php($i = (array) $payment?->instructions)
<div class="commerce-payment commerce-payment--gateway">
    @if (! empty($i['instructions']))<div class="commerce-payment__text">{!! nl2br(e($i['instructions'])) !!}</div>@endif
    @if (! empty($i['url']) && $payment?->status === 'pending')
        <p><a href="{{ $i['url'] }}" class="commerce-button commerce-button--primary" rel="noopener">{{ __('commerce::payments.continue_gateway') }}</a></p>
    @endif
</div>
