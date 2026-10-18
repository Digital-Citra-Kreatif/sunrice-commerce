{{-- Payment instructions (QRIS, e-wallet…) from the payment's snapshot. $order, $payment --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($i = (array) $payment->instructions)
<div class="commerce-payment commerce-payment--instructions">
    <p class="commerce-payment__amount"><strong>{{ $money->format((int) ($i['amount'] ?? $payment->amount)) }}</strong></p>
    @if (! empty($i['image']))<img src="{{ $i['image'] }}" alt="{{ $i['title'] ?? '' }}" class="commerce-payment__image" loading="lazy">@endif
    @if (! empty($i['instructions']))<div class="commerce-payment__text">{!! nl2br(e($i['instructions'])) !!}</div>@endif
    @include('commerce::storefront.payments.confirm-link')
</div>
