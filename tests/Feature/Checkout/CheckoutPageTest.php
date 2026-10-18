<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $this->mug = checkoutStore();
});

it('sends an empty cart back to the cart page', function () {
    $this->get('/checkout')->assertRedirect('/cart');
});

it('shows the sections and the rates for the saved address', function () {
    $cart = cartWith([[$this->mug, 2]]);
    $cart->update(['checkout' => checkoutInput()]);

    $this->get('/checkout')->assertOk()
        ->assertSee('Alamat pengiriman')->assertSee('Reguler')->assertSee('Rp10.000')
        ->assertSee('name="payment_method" value="test_transfer"', false)
        ->assertSee('Rp110.000')
        ->assertSee('Buat pesanan')
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    expect($cart->fresh()->checkout['started_at'])->not->toBeNull();
});

it('refreshes rates and totals as JSON when the address changes', function () {
    cartWith([[$this->mug, 1]]);
    $input = checkoutInput(['shipping_rate' => null]);

    $json = $this->withCredentials()->postJson('/checkout/refresh', ['shipping_address' => $input['shipping_address']])->assertOk()->json();
    expect(array_column($json['rates'], 'label'))->toBe(['Reguler'])
        ->and($json['totals']['shipping']['amount'])->toBe(0)
        ->and($json['rates_html'])->toContain('Reguler');

    $rate = checkoutInput()['shipping_rate'];
    $json = $this->withCredentials()->postJson('/checkout/refresh', ['shipping_rate' => $rate])->json();
    expect($json['totals']['total']['amount'])->toBe(60000)->and($json['selected_rate'])->toBe($rate);

    // Without JavaScript: "Update shipping" saves and comes back.
    $this->post('/checkout', [...$input, 'action' => 'update'])->assertRedirect('/checkout#shipping');
});

it('validates Indonesian addresses and the chosen rate', function () {
    cartWith([[$this->mug, 1]]);
    $this->post('/checkout', [...checkoutInput(['shipping_address' => ['city_code' => '32.04'], 'shipping_rate' => 'flat:999999:default']), 'action' => 'place'])
        ->assertRedirect('/checkout')
        ->assertSessionHasErrors(['shipping_address.district_code', 'shipping_rate']);
    expect(Order::query()->count())->toBe(0);
});

it('applies each checkout setting', function () {
    $settings = new class
    {
        public function saveSection(string $section, array $values): void
        {
            app(StoreSettings::class)->saveSection($section, $values);
        }
    };
    cartWith([[$this->mug, 1]]);
    $place = fn (array $input = []) => $this->post('/checkout', [...checkoutInput($input), 'action' => 'place']);

    $settings->saveSection('checkout', ['require_phone' => true]);
    $place(['phone' => '', 'shipping_address' => ['phone' => '']])->assertSessionHasErrors(['phone', 'shipping_address.phone']);

    $settings->saveSection('checkout', ['require_phone' => false, 'require_postal_code' => true, 'dropshipper' => true, 'terms_page' => 1, 'minimum_order' => 60000]);
    $place(['phone' => '', 'shipping_address' => ['phone' => ''], 'dropship' => ['enabled' => '1']])
        ->assertSessionHasErrors(['shipping_address.postal_code', 'dropship.name', 'terms', 'cart'])
        ->assertSessionDoesntHaveErrors(['phone']);

    $settings->saveSection('checkout', ['company_fields' => true, 'order_notes' => false, 'dropshipper' => false, 'minimum_order' => 0, 'terms_page' => null, 'require_postal_code' => false]);
    $this->get('/checkout')->assertSee('NPWP')->assertDontSee('Catatan pesanan')->assertDontSee('dropship[enabled]', false);

    $settings->saveSection('checkout', ['guest_checkout' => false]);
    $this->get('/checkout')->assertRedirect('/account/login');
});

it('asks no address or shipping when shipping is off or nothing ships', function () {
    $cart = cartWith([[$this->mug, 1]]);
    app(ToggleFeature::class)->handle('shipping', false);
    $this->get('/checkout')->assertOk()->assertDontSee('Alamat pengiriman')->assertDontSee('Perbarui ongkir');

    app(ToggleFeature::class)->handle('shipping', true);
    $this->mug->update(['requires_shipping' => false]);
    $this->get('/checkout')->assertOk()->assertDontSee('Alamat pengiriman');
    $this->post('/checkout', ['name' => 'Rina', 'email' => 'rina@example.com', 'phone' => '0812345678', 'payment_method' => 'test_transfer',
        'action' => 'place', 'totals_hash' => CartView::for($cart->fresh(), ['paymentMethod' => 'test_transfer'])->state->hash()])->assertRedirect();
    expect(Order::query()->sole()->fulfillment_status)->toBe('not_required')->and(Order::query()->sole()->shipping_address)->toBeNull();
});

it('refuses an online store order without any payment method', function () {
    app(StoreSettings::class)->saveSection('payments', ['methods' => []]);
    $cart = cartWith([[$this->mug, 1]]);
    $cart->update(['checkout' => checkoutInput()]);
    $this->get('/checkout')->assertSee('Tidak ada metode pembayaran');
    $this->post('/checkout', [...checkoutInput(), 'action' => 'place'])->assertSessionHasErrors(['payment_method']);
});
