{{-- $data and $loyaltyPoints: the available loyalty balance. --}}
@php($money = app(\Sunrice\Commerce\Support\MoneyFormatter::class))
<fieldset class="commerce-checkout__section" id="checkout-points">
    <legend>{{ __('commerce::checkout.points.title') }}</legend>
    <p id="checkout-points-balance">{{ __('commerce::storefront.cart.points_balance', ['points' => number_format($loyaltyPoints, 0, ',', '.'), 'value' => $money->format($loyaltyPoints)]) }}</p>
    <label class="commerce-check">
        <input type="checkbox" name="use_points" value="1" @checked($data->get('use_points', false)) aria-describedby="checkout-points-balance">
        {{ __('commerce::storefront.cart.points_use') }}
    </label>
    <noscript><button type="submit" name="action" value="update_points" class="commerce-button commerce-button--secondary">{{ __('commerce::checkout.points.update') }}</button></noscript>
</fieldset>
