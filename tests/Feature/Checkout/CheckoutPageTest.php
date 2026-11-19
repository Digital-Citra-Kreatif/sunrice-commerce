<?php

declare(strict_types=1);

use Dom\HTMLDocument;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Taxes\TaxRate;

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

it('selects the first available payment method and prices checkout with its fee', function () {
    $settings = app(StoreSettings::class);
    $methods = $settings->section('payments')['methods'];
    $methods['bank_transfer'] = [
        'active' => true, 'fee_fixed' => 1500,
        'accounts' => [['bank' => 'bca', 'number' => '123', 'holder' => 'PT Toko']],
    ];
    $settings->saveSection('payments', ['order' => ['bank_transfer', 'test_transfer'], 'methods' => $methods]);

    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput(['payment_method' => null]);
    $cart->update(['checkout' => $input]);
    $page = $this->get('/checkout')->assertOk()->assertSee('Rp61.500');
    $document = HTMLDocument::createFromString($page->getContent(), LIBXML_NOERROR);
    expect($document->querySelector('[name=payment_method][checked]')?->getAttribute('value'))->toBe('bank_transfer');

    $this->withCredentials()->postJson('/checkout/refresh', ['payment_method' => 'test_transfer'])
        ->assertOk()->assertJsonPath('selected_payment_method', 'test_transfer')->assertJsonPath('totals.total.amount', 60000);
    $this->postJson('/checkout/refresh', ['shipping_rate' => $input['shipping_rate']])
        ->assertOk()->assertJsonPath('selected_payment_method', 'test_transfer');

    $methods['test_transfer']['active'] = false;
    $settings->saveSection('payments', ['methods' => $methods]);
    $response = $this->postJson('/checkout/refresh', [...$input, 'payment_method' => 'test_transfer'])
        ->assertOk()->assertJsonPath('selected_payment_method', 'bank_transfer')->assertJsonPath('totals.total.amount', 61500);
    $this->post('/checkout', [...$input, 'payment_method' => 'bank_transfer', 'action' => 'place', 'totals_hash' => $response->json('hash')])
        ->assertRedirect()->assertSessionHasNoErrors();
    expect(Order::query()->sole())->payment_method->toBe('bank_transfer')->total->toBe(61500);
});

it('labels the total as estimated until a shipping method is selected', function () {
    cartWith([[$this->mug, 1]]);

    $this->get('/checkout')->assertOk()
        ->assertSee('Estimasi total')
        ->assertSee('Pilih metode pengiriman')
        ->assertSee('Tambahkan alamat pengiriman untuk melihat pilihan kurir.')
        ->assertSee('commerce-checkout-address--guest')
        ->assertSee('data-commerce-checkout-status', false);

    $result = $this->withCredentials()->postJson('/checkout/refresh', checkoutInput())->assertOk()->json();

    expect($result['summary'])->toContain('Rp60.000')->not->toContain('Estimasi total');
});

it('refreshes rates and totals as JSON when the address changes', function () {
    cartWith([[$this->mug, 1]]);
    $input = checkoutInput(['shipping_rate' => null]);

    $json = $this->withCredentials()->postJson('/checkout/refresh', ['shipping_address' => $input['shipping_address']])->assertOk()->json();
    expect(array_column($json['rates'], 'label'))->toBe(['Reguler'])
        ->and($json['selected_rate'])->toBe(checkoutInput()['shipping_rate'])
        ->and($json['totals']['shipping']['amount'])->toBe(10000)
        ->and($json['rates_html'])->toContain('Reguler');

    $rate = checkoutInput()['shipping_rate'];
    $json = $this->withCredentials()->postJson('/checkout/refresh', ['shipping_rate' => $rate])->json();
    expect($json['totals']['total']['amount'])->toBe(60000)->and($json['selected_rate'])->toBe($rate);

    // Without JavaScript: "Update total" saves and comes back.
    $this->post('/checkout', [...$input, 'action' => 'update'])->assertRedirect('/checkout#shipping');
});

it('preselects the first delivery rate on the page and keeps an explicit choice during refresh', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput(['shipping_rate' => null]);
    $cart->update(['checkout' => $input]);
    $zone = ShippingMethod::query()->where('type', 'flat')->firstOrFail()->zone;
    $express = $zone->methods()->create(['type' => 'flat', 'title' => ['id' => 'Ekspres'], 'position' => 1,
        'active' => true, 'settings' => ['cost' => 25000]]);
    $pickup = $zone->methods()->create(['type' => 'pickup', 'title' => ['id' => 'Ambil di toko'], 'position' => 2,
        'active' => true, 'settings' => ['locations' => [['name' => 'Bandung', 'address' => 'Jl. Dago']]]]);
    $regular = checkoutInput()['shipping_rate'];
    $document = HTMLDocument::createFromString($this->get('/checkout')->assertOk()->assertSee('Rp60.000')->getContent(), LIBXML_NOERROR);
    expect($document->querySelector('[name=shipping_rate][checked]')?->getAttribute('value'))->toBe($regular);

    $this->withCredentials()->postJson('/checkout/refresh', ['shipping_rate' => "flat:{$express->id}:default"])
        ->assertOk()->assertJsonPath('selected_rate', "flat:{$express->id}:default")->assertJsonPath('totals.total.amount', 75000);
    $this->postJson('/checkout/refresh', ['shipping_rate' => 'flat:999999:default'])
        ->assertOk()->assertJsonPath('selected_rate', $regular)->assertJsonPath('totals.total.amount', 60000);
    $this->postJson('/checkout/refresh', ['shipping_address' => null, 'shipping_rate' => null])
        ->assertOk()->assertJsonPath('selected_rate', null)->assertJsonPath('rates.0.id', "pickup:{$pickup->id}:loc0");
});

it('keeps the selected address and courier rates available while pickup is selected', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $flat = ShippingMethod::query()->where('type', 'flat')->firstOrFail();
    $pickup = $flat->zone->methods()->create([
        'type' => 'pickup', 'title' => ['id' => 'Ambil di toko'], 'active' => true,
        'settings' => ['locations' => [['name' => 'Bandung', 'address' => 'Jl. Dago 1']]],
    ]);
    $pickupRate = "pickup:{$pickup->id}:loc0";
    $this->withCredentials()->postJson('/checkout/refresh', [...$input, 'shipping_rate' => $pickupRate])
        ->assertOk()->assertJsonPath('selected_rate', $pickupRate)->assertJsonPath('totals.shipping.amount', 0)
        ->assertJsonFragment(['id' => $input['shipping_rate']]);
    $this->get('/checkout')->assertOk()->assertSee('Jl. Sarijadi 1')
        ->assertSee('Alamat pengiriman opsional jika Anda mengambil pesanan di toko.')->assertDontSee('data-commerce-shipping-address hidden', false);
    $this->withCredentials()->postJson('/checkout/refresh', ['shipping_rate' => $input['shipping_rate']])
        ->assertOk()->assertJsonPath('selected_rate', $input['shipping_rate'])->assertJsonPath('totals.shipping.amount', 10000);
    expect($cart->fresh()->checkout['shipping_address']['line1'])->toBe('Jl. Sarijadi 1');

    $pickupInput = [...$input, 'shipping_rate' => $pickupRate];
    $this->post('/checkout', [...$pickupInput, 'action' => 'place', 'totals_hash' => seenHash($cart->fresh(), $pickupInput)])
        ->assertRedirect()->assertSessionHasNoErrors();
    $order = Order::query()->sole();
    expect($order->shipping_address)->toBeNull()
        ->and($order->shipping_total)->toBe(0)
        ->and($order->meta['pickup']['name'])->toBe('Bandung');
});

it('applies and removes coupons in checkout before payment without discarding form data', function () {
    Voucher::query()->create(['name' => 'Hemat', 'code' => 'HEMAT', 'type' => 'fixed_cart', 'value' => 5000]);
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput(['notes' => 'Titip di resepsionis']);
    $page = $this->get('/checkout')->assertOk()->assertSeeInOrder(['Pakai kupon', 'name="voucher_code"', 'id="payment"'], false)
        ->assertDontSee('data-commerce-checkout-retry', false);
    $document = HTMLDocument::createFromString($page->getContent(), LIBXML_NOERROR);
    expect($document->querySelector('#checkout-vouchers details'))->toBeNull()
        ->and($document->querySelector('#order-notes.commerce-accordion > summary'))->not->toBeNull();
    $this->get('/cart')->assertOk()->assertDontSee('data-commerce-voucher-form', false);

    $this->withCredentials()->postJson('/checkout/voucher', [...$input, 'voucher_code' => 'hemat'])
        ->assertOk()->assertJsonPath('totals.total.amount', 55000);
    expect($cart->fresh()->vouchers)->toBe(['HEMAT'])
        ->and($cart->fresh()->checkout['notes'])->toBe('Titip di resepsionis');
    $invalid = $this->withCredentials()->postJson('/checkout/voucher', [...$input, 'voucher_code' => 'invalid'])
        ->assertOk()->assertJsonPath('totals.total.amount', 55000);
    expect($invalid->json('vouchers_html'))->toContain('Kode INVALID tidak ditemukan.')
        ->and($cart->fresh()->vouchers)->toBe(['HEMAT']);
    $this->post('/checkout/voucher', [...$input, 'remove_voucher' => 'HEMAT'])->assertRedirect('/checkout#checkout-vouchers');
    expect($cart->fresh()->vouchers)->toBe([]);
});

it('clears unchecked flags when refreshing a full checkout form and keeps them for partial requests', function () {
    app(ToggleFeature::class)->handle('taxes', true);
    app(StoreSettings::class)->saveSection('taxes', ['prices_include_tax' => false, 'based_on' => 'billing']);
    TaxRate::query()->create(['name' => 'PPN', 'rate' => 1100, 'tax_class' => 'standard']);
    TaxRate::query()->create(['name' => 'PPN', 'rate' => 1200, 'tax_class' => 'standard', 'country' => 'US']);
    $cart = cartWith([[$this->mug, 1]]);
    $cart->update(['checkout' => checkoutInput()]);
    $input = checkoutInput(['billing_address' => [
        'name' => 'Rina', 'phone' => '202 555 0100', 'country' => 'US', 'state' => 'DC',
        'city' => 'Washington', 'line1' => '100 Example Street', 'postal_code' => '20001',
    ]]);
    unset($input['billing_same']);

    $this->withCredentials()->postJson('/checkout/refresh', $input)
        ->assertOk()->assertJsonPath('totals.tax.amount', 6600);
    $refresh = $this->withCredentials()->postJson('/checkout/refresh', [...$input, '_form' => 'checkout'])
        ->assertOk()->assertJsonPath('totals.tax.amount', 7200);
    expect($cart->fresh()->checkout['billing_same'])->toBeFalse();

    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => $refresh->json('hash')])
        ->assertRedirect()->assertSessionDoesntHaveErrors();
    expect(Order::query()->sole()->billing_address['country'])->toBe('US');
});

it('keeps a hidden payment step for a free cart and supplies methods once shipping adds a charge', function () {
    cartWith([[$this->mug, 1]]);
    Voucher::query()->create(['name' => 'Free product', 'code' => 'FREE', 'type' => 'percent', 'value' => 10000]);
    $this->post('/cart/vouchers', ['code' => 'FREE'])->assertRedirect()->assertSessionHas('commerce.success');
    $free = $this->get('/checkout')->assertOk()
        ->assertSee('data-commerce-payments', false)
        ->assertDontSee('name="payment_method"', false);
    expect($free->getContent())->toMatch('/data-commerce-payment-step\s+hidden/')
        ->toMatch('/data-commerce-payment-section\s+hidden/');

    $input = checkoutInput(['payment_method' => null]);
    $refresh = $this->withCredentials()->postJson('/checkout/refresh', [...$input, '_form' => 'checkout'])
        ->assertOk()->assertJsonPath('totals.total.amount', 10000);
    expect($refresh->json('payments_html'))->toContain('data-commerce-payments', 'test_transfer');

    $this->post('/checkout', [...$input, 'action' => 'update'])->assertRedirect('/checkout#shipping');
    $paid = $this->get('/checkout')->assertOk()->assertSee('name="payment_method" value="test_transfer"', false);
    expect($paid->getContent())->not->toMatch('/data-commerce-payment-step\s+hidden/')
        ->not->toMatch('/data-commerce-payment-section\s+hidden/');
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
    $place(['phone' => '', 'shipping_address' => ['phone' => '']])
        ->assertSessionHasErrors('shipping_address.phone')->assertSessionDoesntHaveErrors('phone');

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
