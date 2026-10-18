<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Cache;
use Illuminate\Testing\TestResponse;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\WebhookCall;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Commerce\FakeGateway;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    app(Commerce::class)->registerPaymentMethod(FakeGateway::class);
    $stored = (array) app(StoreSettings::class)->get('payments.methods');
    app(StoreSettings::class)->saveSection('payments', ['methods' => [...$stored, 'fake_gateway' => ['active' => true, 'title' => ['id' => 'Kartu', 'en' => 'Card'], 'secret' => 's3cret', 'fee_percent' => 2]]]);
    app()->forgetScopedInstances();
});

function webhook(array $payload, ?string $secret = 's3cret'): TestResponse
{
    $body = json_encode($payload);

    return test()->call('POST', '/commerce/webhooks/fake_gateway', [], [], [], [
        'CONTENT_TYPE' => 'application/json', 'HTTP_X_SIGNATURE' => hash_hmac('sha256', (string) $body, (string) $secret),
    ], $body);
}

function placeWithGateway(Variant $mug): Order
{
    $cart = cartWith([[$mug, 1]]);
    $input = checkoutInput(['payment_method' => 'fake_gateway']);
    $response = test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)]);
    $order = Order::query()->sole();
    // The fake gateway's reference is FAKE-{payment id} (ids keep counting between tests on MySQL and PostgreSQL).
    $response->assertRedirect('https://pay.example/checkout/'.fakeReference($order));

    return $order;
}

function fakeReference(Order $order, int $nth = 0): string
{
    return 'FAKE-'.($order->payments()->reorder('id')->value('id') + $nth);
}

it('adds the method fee to the totals and sends the customer to the gateway', function () {
    $order = placeWithGateway($this->mug);
    expect($order->fee_total)->toBe(1200)  // 2% of 60.000
        ->and($order->total)->toBe(61200)
        ->and($order->adjustments->firstWhere('kind', 'fee')->source_type)->toBe('payment_fee')
        ->and($order->payments->sole()->reference)->toBe(fakeReference($order));
});

it('completes by webhook, ignoring duplicates, stale results and bad signatures', function () {
    $order = placeWithGateway($this->mug);
    $ref = fakeReference($order);

    webhook(['event_id' => 'evt-1', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200], 'wrong')->assertStatus(400);
    expect($order->fresh()->payment_status)->toBe('unpaid')->and(WebhookCall::query()->sole()->status)->toBe('failed');

    webhook(['event_id' => 'evt-1', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertOk();
    $order->refresh();
    expect([$order->status, $order->payment_status, $order->paid_total])->toBe(['processing', 'paid', 61200]);

    webhook(['event_id' => 'evt-1', 'reference' => $ref, 'status' => 'paid', 'amount' => 61200])->assertOk()->assertJson(['duplicate' => true]);
    webhook(['event_id' => 'evt-2', 'reference' => $ref, 'status' => 'pending'])->assertOk();
    $order->refresh();
    expect([$order->payment_status, $order->paid_total])->toBe(['paid', 61200])
        ->and(WebhookCall::query()->orderBy('id')->pluck('status')->all())->toBe(['failed', 'processed', 'ignored', 'ignored']);
});

it('records the gateway return and checks status once before expiring', function () {
    $order = placeWithGateway($this->mug);
    $ref = fakeReference($order);
    $this->get("/order/{$order->order_key}/payment/return?status=failed")->assertRedirect($order->url());
    expect($order->fresh()->status)->toBe('failed');

    // Paid at the gateway though we never heard: the check before expiry finds it.
    Cache::put('fake-gateway:'.$ref, 'paid');
    $this->travel(25)->hours();
    $this->artisan('commerce:tick');
    expect($order->fresh()->payment_status)->toBe('paid');
});

it('lets the customer switch methods on the pay page, the fee following', function () {
    $order = placeWithGateway($this->mug);
    $this->get("/order/{$order->order_key}/pay")->assertOk()->assertSee('Kartu')->assertSee('Transfer');

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'test_transfer'])->assertRedirect($order->url());
    $order->refresh();
    expect($order->payment_method)->toBe('test_transfer')->and($order->fee_total)->toBe(0)->and($order->total)->toBe(60000)
        ->and($order->payments->pluck('status', 'method')->all())->toBe(['fake_gateway' => 'cancelled', 'test_transfer' => 'pending'])
        ->and($order->payments->last()->amount)->toBe(60000);

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'fake_gateway'])->assertRedirect('https://pay.example/checkout/'.fakeReference($order, 2));
    expect($order->fresh()->total)->toBe(61200);

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'nope'])->assertSessionHas('commerce.error');
});

it('manages methods in Settings → Payments', function () {
    actingAsUserWith(['commerce.settings.payments']);
    $this->get('/cms/commerce/settings/payments')->assertOk()->assertInertia(fn ($p) => $p->component('Commerce/Settings/Payments')
        ->where('methods', fn ($m) => collect($m)->pluck('key')->all() === ['bank_transfer', 'cod', 'fake_gateway', 'test_transfer']));
    $this->post('/cms/commerce/settings/payments/move', ['key' => 'test_transfer', 'direction' => 'up']);
    $this->put('/cms/commerce/settings/payments/fake_gateway/active', ['active' => false]);
    $this->put('/cms/commerce/settings/payments/test_transfer', ['values' => ['active' => true, 'title' => ['id' => 'Transfer BCA'], 'countries' => 'id, sg', 'account' => '777']])
        ->assertRedirect('/cms/commerce/settings/payments');
    app()->forgetScopedInstances();
    expect(app(StoreSettings::class)->get('payments.order'))->toBe(['bank_transfer', 'cod', 'test_transfer', 'fake_gateway'])
        ->and(app(StoreSettings::class)->get('payments.methods.fake_gateway.active'))->toBeFalse()
        ->and(app(StoreSettings::class)->get('payments.methods.test_transfer.countries'))->toBe(['ID', 'SG'])
        ->and(app(StoreSettings::class)->get('payments.methods.test_transfer.account'))->toBe('777');
});

it('adds and removes payment instruction methods', function () {
    actingAsUserWith(['commerce.settings.payments']);
    $this->post('/cms/commerce/settings/payments/instances', ['type' => 'instructions'])->assertRedirect();
    app()->forgetScopedInstances();
    $key = app(StoreSettings::class)->get('payments.instances.instructions')[0];
    expect($key)->toStartWith('instructions_');
    $this->put("/cms/commerce/settings/payments/{$key}", ['values' => ['active' => true, 'title' => ['id' => 'QRIS'], 'instructions' => ['id' => 'Pindai kode QR.']]])->assertRedirect();
    app()->forgetScopedInstances();
    expect(PaymentManager::titleOf(app(PaymentManager::class)->get($key)))->toBe('QRIS');
    $this->delete("/cms/commerce/settings/payments/{$key}")->assertRedirect();
    app()->forgetScopedInstances();
    expect(app(PaymentManager::class)->get($key))->toBeNull();
});
