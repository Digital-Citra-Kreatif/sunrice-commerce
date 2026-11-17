<?php

declare(strict_types=1);

use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\ShippingRequest;

beforeEach(function () {
    $this->mug = checkoutStore();
    app(StoreSettings::class)->saveSection('general', ['address' => ['line1' => 'Jl. Toko 1', 'postal_code' => '40111', 'region' => ['country' => 'ID', 'province_code' => '32']]]);
    app()->forgetScopedInstances();
});

function placeMug($mug)
{
    app()->forgetScopedInstances();
    $cart = cartWith([[$mug, 1]]);

    return app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order->fresh();
}

it('ships from the store address when no extension says otherwise', function () {
    $order = placeMug($this->mug);

    expect($order->meta('shipping_origin'))->toBeNull()
        ->and($order->shippingOrigin()->get('postal_code'))->toBe('40111')
        ->and($order->shippingOrigin()->get('province_code'))->toBe('32');
});

it('quotes and books from the origin an extension chooses for the cart', function () {
    app(Commerce::class)->shippingOriginUsing(fn (CalculationState $state) => ['name' => 'Cabang Bandung', 'line1' => 'Jl. Riau 5', 'postal_code' => '40115',
        'country' => 'ID', 'latitude' => '-6.91', 'longitude' => '107.62']);
    $cart = cartWith([[$this->mug, 1]]);
    $state = CartView::for($cart, CheckoutData::fromCart($cart)->merge(checkoutInput())->context())->state;

    $request = ShippingRequest::fromState($state);
    expect($request->origin->get('postal_code'))->toBe('40115')->and($request->origin->get('latitude'))->toBe('-6.91');

    $order = placeMug($this->mug);
    expect($order->meta('shipping_origin.name'))->toBe('Cabang Bandung')
        ->and($order->shippingOrigin()->get('longitude'))->toBe('107.62');
});
