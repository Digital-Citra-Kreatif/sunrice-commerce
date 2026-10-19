{{--
    The order summary at checkout. $cart (CartView), $state. Lines after
    the first commerce.cart.preview_lines are folded in a <details>.
--}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
@php($preview = max(1, (int) config('commerce.cart.preview_lines', 10)))
<h2>{{ __('commerce::checkout.sections.summary') }}</h2>
@foreach (['shown' => array_slice($cart->lines, 0, $preview), 'more' => array_slice($cart->lines, $preview)] as $part => $rows)
    @continue($part === 'more' && $rows === [])
    @if ($part === 'more')<details class="commerce-summary__more"><summary>{{ __('commerce::storefront.cart.more_lines', ['count' => count($rows)]) }}</summary>@endif
    <ul class="commerce-summary__lines">
        @foreach ($rows as $row)
            <li>
                <span class="commerce-summary__qty">{{ $row['line']->quantity }} ×</span>
                <span class="commerce-summary__name">{{ $row['entry']?->title }}@if ($row['line']->variant->title !== '') ({{ $row['line']->variant->title }})@endif</span>
                <span class="commerce-summary__price">{{ $money->format($row['line']->subtotal) }}</span>
            </li>
        @endforeach
    </ul>
    @if ($part === 'more')</details>@endif
@endforeach
@foreach (collect($state->notices)->whereNotIn('code', ['voucher_conditional', 'price_changed']) as $notice)
    <p class="commerce-notice">{{ $notice['message'] }}</p>
@endforeach
@include(\Sunrice\Commerce\Storefront\Layout::view('partials.totals'), ['state' => $state])
