{{-- Cash on delivery. $order, $payment --}}
@php($i = (array) $payment->instructions)
<div class="commerce-payment commerce-payment--cod">
    <p>{{ __('commerce::payments.cod') }}</p>
    @if (! empty($i['instructions']))<div class="commerce-payment__text">{!! nl2br(e($i['instructions'])) !!}</div>@endif
</div>
