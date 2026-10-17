<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Database\Seeders\CommerceRolesSeeder;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Workbench\App\Models\User;

/*
 * End to end (ARCHITECTURE.md §28): install with the demo store, then for
 * each selling mode do what a customer and a shop manager would, over
 * HTTP: browse, filter, add to cart, apply a voucher, check out with an
 * Indonesian address, confirm the transfer, approve it, ship, complete,
 * refund, and download the digital product.
 */

beforeEach(function () {
    Storage::fake('local');
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    (new RegionImporter(__DIR__.'/../Fixtures/regions'))->import(4);
    $this->artisan('commerce:install', ['--demo' => true, '--no-regions' => true, '--no-interaction' => true])->assertSuccessful();
    $this->manager = User::query()->create(['name' => 'Manager', 'email' => 'manager@example.com', 'password' => bcrypt('password')]);
    $this->manager->assignRole(CommerceRolesSeeder::SHOP_MANAGER);
    $this->product = fn (string $sku) => Variant::query()->where('sku', $sku)->firstOrFail();
});

afterEach(fn () => @unlink(config_path('commerce.php')));

function sellingMode(string $mode): void
{
    $settings = app(StoreSettings::class);
    $settings->saveSection('general', [...$settings->section('general'), 'selling_mode' => $mode,
        'whatsapp' => ['numbers' => [['number' => '0812 0000 0000', 'name' => 'Toko']], 'rotation' => 'random']]);
    app(Features::class)->flush();
    app()->forgetScopedInstances();
}

/** The visitor's cart after a storefront request created it (the test client keeps no response cookies). */
function visitorCart(): Cart
{
    $cart = Cart::query()->latest('id')->firstOrFail();
    test()->withCookie('commerce_cart', $cart->token);

    return $cart;
}

/** @return array<string, mixed> */
function bandungAddress(string $rate): array
{
    return checkoutInput(['shipping_rate' => $rate, 'payment_method' => 'bank_transfer', 'email' => 'rina@example.com']);
}

it('sells in the online store: from browsing to a refund and a download', function () {
    sellingMode('shop');

    // Browse and filter.
    $this->get('/products')->assertOk()->assertSee('Gelas Kopi')->assertSee('Kaos Kopi');
    $this->get('/products?in_stock=1&sort=price')->assertOk();
    $this->get('/products/kaos-kopi')->assertOk()->assertSee('name="options[size]"', false);

    // Add a variant by its options (no JavaScript), the e-book and the mug.
    $kaos = ($this->product)('DEMO-KAOS-M');
    $this->post('/cart/items', ['product' => $kaos->product_id, 'options' => ['size' => 'm'], 'quantity' => 1])->assertRedirect();
    $cart = visitorCart();
    $this->post('/cart/items', ['variant' => ($this->product)('DEMO-EBOOK')->id, 'quantity' => 1])->assertRedirect();
    $this->post('/cart/items', ['variant' => ($this->product)('DEMO-MUG')->id, 'quantity' => 2])->assertRedirect();
    expect($cart->fresh()->items)->toHaveCount(3);

    // The voucher (10% over Rp100.000).
    $this->post('/cart/vouchers', ['code' => 'kopi10'])->assertRedirect()->assertSessionHasNoErrors();
    $this->get('/cart')->assertOk()->assertSee('KOPI10');

    // Check out with a Bandung address, weight-based shipping and a bank transfer.
    $rate = 'weight:'.ShippingMethod::query()->where('type', 'weight')->value('id').':default';
    $input = bandungAddress($rate);
    $this->get('/checkout')->assertOk();
    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();
    $order = Order::query()->where('channel', 'storefront')->latest('id')->firstOrFail();
    expect($order)->status->toBe('pending')->payment_status->toBe('unpaid')
        ->and($order->discount_total)->toBeGreaterThan(0)
        ->and($order->shipping_address['city'])->toBe('Kota Bandung');
    $this->get($order->url())->assertOk()->assertSee('1234567890');

    // The customer confirms the transfer; the shop manager approves it.
    $this->post('/confirm-payment', ['order' => $order->order_key, 'sender_name' => 'Rina', 'sender_bank' => 'BCA', 'amount' => $order->total,
        'transferred_at' => now()->toDateString(), 'account' => 0, 'proof' => UploadedFile::fake()->create('bukti.pdf', 100, 'application/pdf')])->assertRedirect();
    $confirmation = PaymentConfirmation::query()->where('order_id', $order->id)->firstOrFail();
    $this->actingAs($this->manager)->post("/cms/commerce/confirmations/{$confirmation->id}/approve")->assertRedirect();
    expect($order->refresh())->payment_status->toBe('paid')->status->toBe('processing');

    // The digital file is ready right away.
    $grant = DownloadGrant::query()->where('order_id', $order->id)->firstOrFail();
    auth()->logout();
    $this->get('/downloads/'.$grant->token)->assertRedirect('https://example.com/resep-kopi.pdf');

    // Ship the physical items, complete, refund one mug.
    $this->actingAs($this->manager);
    $items = $order->items()->whereNull('parent_id')->where('requires_shipping', true)->get()
        ->map(fn ($i) => ['order_item_id' => $i->id, 'quantity' => $i->quantity])->all();
    $this->post("/cms/commerce/orders/{$order->id}/shipments", ['courier' => 'jne', 'tracking_number' => 'JNE123', 'items' => $items])->assertRedirect()->assertSessionHasNoErrors();
    expect($order->refresh()->fulfillment_status)->toBe('shipped');
    $this->post("/cms/commerce/orders/{$order->id}/transition", ['to' => 'completed'])->assertRedirect();
    expect($order->refresh()->status)->toBe('completed');
    $mug = $order->items()->where('sku', 'DEMO-MUG')->firstOrFail();
    $this->post("/cms/commerce/orders/{$order->id}/refunds", ['amount' => $mug->unit_price, 'reason' => 'Pecah', 'restock' => false,
        'items' => [['order_item_id' => $mug->id, 'quantity' => 1]]])->assertRedirect()->assertSessionHasNoErrors();
    expect($order->refresh())->refunded_total->toBe($mug->unit_price)->payment_status->toBe('partially_refunded');

    // The customer sees it all on the order page.
    auth()->logout();
    $this->get($order->url())->assertOk()->assertSee('JNE123');
});

it('takes quote requests, prices them and turns accepted quotes into orders', function () {
    sellingMode('quote');
    $this->post('/cart/items', ['variant' => ($this->product)('DEMO-BEANS')->id, 'quantity' => 30])->assertRedirect();
    $cart = visitorCart();
    expect($cart->items()->sole()->quantity)->toBe(30);
    $input = checkoutInput(['email' => 'pt@example.com', 'shipping_rate' => null, 'payment_method' => null]);
    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();
    $quote = Order::query()->where('type', 'quote')->firstOrFail();
    expect($quote->status)->toBe('requested');

    // The shop manager prices it (a bulk price) and sends it.
    $line = $quote->items()->firstOrFail();
    $this->actingAs($this->manager)->put("/cms/commerce/orders/{$quote->id}/quote", [
        'lines' => [['item_id' => $line->id, 'variant_id' => $line->variant_id, 'quantity' => 30, 'unit_price' => 70000]],
        'shipping' => ['label' => 'Kargo', 'cost' => 50000], 'send' => true,
    ])->assertRedirect()->assertSessionHasNoErrors();
    expect($quote->refresh())->status->toBe('quoted')->total->toBe(30 * 70000 + 50000);

    // The customer accepts: an order to pay.
    auth()->logout();
    $this->post("/quote/{$quote->order_key}/accept")->assertRedirect();
    // The quote itself becomes the order, keeping its quote number.
    $order = $quote->refresh();
    expect($order)->type->toBe('order')->status->toBe('pending')->payment_status->toBe('unpaid')
        ->and($order->number)->toStartWith('ORD-')->and($order->quote_number)->not->toBeNull()
        ->and($order->total)->toBe(30 * 70000 + 50000);
});

it('sends WhatsApp orders to the store\'s number', function () {
    sellingMode('whatsapp');
    $this->post('/cart/items', ['variant' => ($this->product)('DEMO-BEANS')->id, 'quantity' => 2])->assertRedirect();
    $cart = visitorCart();
    $input = checkoutInput(['shipping_rate' => 'weight:'.ShippingMethod::query()->where('type', 'weight')->value('id').':default', 'payment_method' => null]);
    $response = $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)]);

    $order = Order::query()->where('channel', 'storefront')->latest('id')->firstOrFail();
    $response->assertRedirect($order->url().'?whatsapp=1');
    expect($order->meta('whatsapp_url'))->toStartWith('https://wa.me/6281200000000');
});

it('shows a catalog without a cart', function () {
    sellingMode('catalog');

    $this->get('/products/gelas-kopi')->assertOk()->assertSee('Gelas Kopi')->assertDontSee('action="'.url('/cart/items').'"', false);
    $this->post('/cart/items', ['variant' => ($this->product)('DEMO-MUG')->id, 'quantity' => 1])->assertNotFound();   // no cart in this mode
});
