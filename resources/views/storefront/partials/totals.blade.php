{{-- Totals of a calculation. $state: Sunrice\Commerce\Pricing\CalculationState --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($shippingPending = $state->shipping['needed'] && ! $state->shipping['rate'])
<dl class="commerce-totals">
    <div><dt>{{ __('commerce::storefront.cart.subtotal') }}</dt><dd>{{ $money->format($state->totals['subtotal']) }}</dd></div>
    @foreach ($state->adjustmentsOfType('discount') as $adjustment)
        <div class="commerce-totals__discount"><dt>{{ $adjustment->label }}</dt><dd>-{{ $money->format($adjustment->amount) }}</dd></div>
    @endforeach
    @if ($state->shipping['needed'])
        <div><dt>{{ __('commerce::storefront.cart.shipping') }}</dt><dd>{{ $state->shipping['rate'] ? $money->format($state->totals['shipping']) : __(! empty($atCheckout) ? 'commerce::checkout.shipping_pending' : 'commerce::storefront.cart.shipping_later') }}</dd></div>
    @endif
    @foreach ($state->adjustmentsOfType('shipping_discount') as $adjustment)
        <div class="commerce-totals__discount"><dt>{{ $adjustment->label }}</dt><dd>-{{ $money->format($adjustment->amount) }}</dd></div>
    @endforeach
    @foreach ([...$state->adjustmentsOfType('fee'), ...$state->adjustmentsOfType('unique_code')] as $adjustment)
        <div><dt>{{ $adjustment->label }}</dt><dd>{{ $money->format($adjustment->amount) }}</dd></div>
    @endforeach
    @if ($state->totals['tax'] > 0)
        <div><dt>{{ __('commerce::storefront.cart.tax') }}</dt><dd>{{ ($state->data['prices_include_tax'] ?? true) ? __('commerce::storefront.cart.tax_included', ['amount' => $money->format($state->totals['tax'])]) : $money->format($state->totals['tax']) }}</dd></div>
    @endif
    @foreach ($state->adjustmentsOfType('points') as $adjustment)
        <div class="commerce-totals__discount"><dt>{{ $adjustment->label }}</dt><dd>-{{ $money->format($adjustment->amount) }}</dd></div>
    @endforeach
    <div class="commerce-totals__total"><dt>{{ __($shippingPending ? 'commerce::storefront.cart.estimated_total' : 'commerce::storefront.cart.total') }}</dt><dd>{{ $money->format($state->totals['total']) }}</dd></div>
    @if (($deposit = $state->depositDue()) !== null)
        <div class="commerce-totals__deposit"><dt>{{ $state->deposit['label'] ?? __('commerce::payments.deposit_now') }}</dt><dd>{{ $money->format($deposit) }}</dd></div>
        <div class="commerce-totals__balance"><dt>{{ ($state->deposit['balance_due_at'] ?? null) ? __('commerce::payments.balance_due_by', ['date' => \Illuminate\Support\Carbon::parse($state->deposit['balance_due_at'])->translatedFormat('j F Y')]) : __('commerce::payments.balance_later') }}</dt><dd>{{ $money->format($state->totals['total'] - $deposit) }}</dd></div>
    @endif
</dl>
