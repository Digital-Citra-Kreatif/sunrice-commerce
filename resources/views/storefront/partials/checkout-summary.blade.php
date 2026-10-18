{{-- The order summary at checkout. $cart (CartView), $state --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<h2>{{ __('commerce::checkout.sections.summary') }}</h2>
<ul class="commerce-summary__lines">
    @foreach ($cart->lines as $row)
        <li>
            <span class="commerce-summary__qty">{{ $row['line']->quantity }} ×</span>
            <span class="commerce-summary__name">{{ $row['entry']?->title }}@if ($row['line']->variant->title !== '') ({{ $row['line']->variant->title }})@endif</span>
            <span class="commerce-summary__price">{{ $money->format($row['line']->subtotal) }}</span>
        </li>
    @endforeach
</ul>
@foreach (collect($state->notices)->whereNotIn('code', ['voucher_conditional', 'price_changed']) as $notice)
    <p class="commerce-notice">{{ $notice['message'] }}</p>
@endforeach
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.totals'), ['state' => $state])
