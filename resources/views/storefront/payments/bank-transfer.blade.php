{{-- Bank transfer instructions from the payment's snapshot. $order, $payment --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($i = (array) $payment->instructions)
<div class="commerce-payment commerce-payment--bank-transfer">
    <p class="commerce-payment__amount">
        <strong data-commerce-copy="{{ $i['amount'] ?? $payment->amount }}">{{ $money->format((int) ($i['amount'] ?? $payment->amount)) }}</strong>
        <button type="button" class="commerce-link" data-commerce-copy-button>{{ __('commerce::payments.copy') }}</button>
    </p>
    @if (! empty($i['unique_code']))
        <p class="commerce-payment__note">{{ __('commerce::payments.exact_amount', ['amount' => $money->format((int) ($i['amount'] ?? $payment->amount))]) }}</p>
    @endif
    <ul class="commerce-payment__accounts">
        @foreach ((array) ($i['accounts'] ?? []) as $account)
            <li>
                @if (! empty($account['logo']))<img src="{{ $account['logo'] }}" alt="" height="24">@endif
                <strong>{{ $account['bank'] }}</strong>
                <span data-commerce-copy="{{ $account['number'] }}">{{ $account['number'] }}</span>
                <button type="button" class="commerce-link" data-commerce-copy-button>{{ __('commerce::payments.copy') }}</button>
                <span>{{ __('commerce::payments.holder') }}: {{ $account['holder'] }}</span>
                @if (! empty($account['branch']))<span>{{ $account['branch'] }}</span>@endif
            </li>
        @endforeach
    </ul>
    @if (! empty($i['instructions']))<div class="commerce-payment__text">{!! nl2br(e($i['instructions'])) !!}</div>@endif
    @include('commerce::storefront.payments.confirm-link')
</div>
