{{-- Payment instructions (QRIS, e-wallet…) from the payment's snapshot. $order, $payment --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($i = (array) $payment->instructions)
<div @class(['commerce-payment', 'commerce-payment--instructions', 'commerce-payment--with-image' => ! empty($i['image'])])>
    @if ($showAmount ?? true)
        <p class="commerce-payment__amount"><strong>{{ $money->format((int) ($i['amount'] ?? $payment->amount)) }}</strong></p>
    @endif
    @if (! empty($i['image']))
        <img src="{{ $i['image'] }}" alt="{{ $i['title'] ?? '' }}" class="commerce-payment__image" loading="lazy">
    @endif
    <div class="commerce-payment__steps">
        @if (! empty($i['instructions']))<div class="commerce-payment__text">{!! nl2br(e($i['instructions'])) !!}</div>@endif
        @include(\Sunrice\Commerce\Storefront\Layout::view('payments.confirm-link'))
    </div>
</div>
