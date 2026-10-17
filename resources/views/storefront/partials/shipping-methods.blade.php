{{-- Shipping rates for the current address. $state, $data --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<div class="commerce-shipping-methods" data-commerce-rates>
    @forelse ($state->shipping['rates'] as $rate)
        <label class="commerce-radio">
            <input type="radio" name="shipping_rate" value="{{ $rate['id'] }}" @checked($data->shippingRate() === $rate['id']) data-pickup="{{ str_starts_with($rate['id'], 'pickup:') ? '1' : '0' }}">
            <span class="commerce-radio__label">{{ $rate['label'] }}</span>
            @if (! empty($rate['eta']))<span class="commerce-radio__meta">{{ $rate['eta'] }}</span>@endif
            <span class="commerce-radio__price">{{ $rate['cost'] > 0 ? $money->format((int) $rate['cost']) : __('commerce::checkout.free') }}</span>
            @if (! empty($rate['meta']['location']['address']))<small class="commerce-radio__detail">{{ $rate['meta']['location']['address'] }}</small>@endif
        </label>
    @empty
        <p class="commerce-shipping-methods__empty">{{ $data->shippingAddress() === null ? __('commerce::checkout.enter_address') : __('commerce::checkout.errors.no_rates') }}</p>
    @endforelse
    @include(\Sunrice\Commerce\Storefront\Layout::view('partials.field-error'), ['name' => 'shipping_rate'])
</div>
