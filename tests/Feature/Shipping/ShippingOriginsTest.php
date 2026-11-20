<?php

declare(strict_types=1);

use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\ShippingOrigins;
use Sunrice\Commerce\Shipping\ShippingRequest;
use Sunrice\Commerce\Support\Coordinates;

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

it('ships from a separate origin when the store address isn\'t it, with map points from pasted coordinates', function () {
    $settings = app(StoreSettings::class);
    $settings->saveSection('general', ['address' => [...$settings->get('general.address'), 'coordinates' => '-6.9147, 107.6098']]);
    $store = ShippingOrigins::store();
    expect($store->get('line1'))->toBe('Jl. Toko 1')->and($store->get('latitude'))->toBe('-6.9147')->and($store->get('longitude'))->toBe('107.6098');

    $settings->saveSection('general', ['ship_from_store' => false, 'origin' => ['name' => 'Gudang', 'phone' => '0812', 'line1' => 'Jl. Gudang 9', 'postal_code' => '40200',
        'region' => ['country' => 'ID', 'province_code' => '32'], 'coordinates' => '-6.95,107.7']]);
    $origin = placeMug($this->mug)->shippingOrigin();
    expect($origin->get('line1'))->toBe('Jl. Gudang 9')->and($origin->get('name'))->toBe('Gudang')->and($origin->get('longitude'))->toBe('107.7')
        // Invoices keep the store address.
        ->and(ShippingOrigins::storeAddress()->get('line1'))->toBe('Jl. Toko 1');

    // Switched back on: the store address again, the origin kept for later.
    app(StoreSettings::class)->saveSection('general', ['ship_from_store' => true]);
    expect(ShippingOrigins::store()->get('line1'))->toBe('Jl. Toko 1');
});

it('takes coordinates as Google Maps copies them and refuses anything else', function () {
    expect(Coordinates::parse('-6.2297, 106.8166'))->toBe(['latitude' => '-6.2297', 'longitude' => '106.8166'])
        ->and(Coordinates::parse('Jakarta'))->toBeNull()
        ->and(Coordinates::parse('95, 10'))->toBeNull()
        ->and(Coordinates::parse(null))->toBeNull();

    actingAsUserWith(['commerce.settings.general']);
    $general = ['name' => 'Toko', 'selling_mode' => 'shop', 'currency' => ['code' => 'IDR', 'symbol' => 'Rp', 'decimals' => 0]];
    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'address' => ['line1' => 'Jl. A', 'coordinates' => 'not a place']]])
        ->assertSessionHasErrors('values.address.coordinates');
    $this->put('/admin/commerce/settings/general', ['values' => [...$general, 'address' => ['line1' => 'Jl. A', 'coordinates' => '-6.2297, 106.8166']]])
        ->assertSessionHasNoErrors();
    expect(app(StoreSettings::class)->get('general.address.coordinates'))->toBe('-6.2297, 106.8166');
});
