<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Commerce\FakeRedirectGateway;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    FakeRedirectGateway::$created = 0;
    FakeRedirectGateway::$status = 'pending';
    app(Commerce::class)->registerPaymentMethod(FakeRedirectGateway::class);
    $stored = (array) app(StoreSettings::class)->get('payments.methods');
    app(StoreSettings::class)->saveSection('payments', ['methods' => [...$stored, 'fake_redirect' => ['active' => true, 'title' => ['id' => 'Bayar online'],
        'instructions' => ['id' => 'Bayar lewat halaman pembayaran.']]]]);
    app()->forgetScopedInstances();
});

function placeWithRedirect(Variant $mug): Order
{
    $cart = cartWith([[$mug, 1]]);
    $input = checkoutInput(['payment_method' => 'fake_redirect']);
    test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirectContains('https://redirect.example/');

    return Order::query()->sole();
}

it('creates the gateway page once per payment and keeps it', function () {
    $order = placeWithRedirect($this->mug);
    $payment = $order->payments->sole();

    expect(FakeRedirectGateway::$created)->toBe(1)
        ->and($payment->instructions['url'])->toBe('https://redirect.example/'.$payment->reference)
        ->and($payment->instructions['instructions'])->toBe('Bayar lewat halaman pembayaran.')
        ->and($payment->meta)->toMatchArray(['token' => 'tok-1', 'sandbox' => true]);

    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'fake_redirect'])->assertRedirect($payment->instructions['url']);
    expect(FakeRedirectGateway::$created)->toBe(1);

    $this->get($order->url())->assertSee('https://redirect.example/'.$payment->reference, false);
});

it('marks the order paid only for the amount asked, and asks the gateway on return', function () {
    $order = placeWithRedirect($this->mug);
    $payment = $order->payments->sole();
    $hook = fn (float $paid) => $this->postJson('/commerce/webhooks/fake_redirect', ['reference' => $payment->reference, 'paid' => $paid]);

    $hook($payment->amount - 1000)->assertStatus(400);
    expect($order->fresh()->payment_status)->toBe('unpaid');

    $this->get("/order/{$order->order_key}/payment/return?status=paid");
    expect($order->fresh()->payment_status)->toBe('unpaid');   // the query string is not trusted

    $hook($payment->amount)->assertOk();
    expect($order->fresh()->payment_status)->toBe('paid');
});

it('shows which keys are set, never their values, and the notification URL', function () {
    config(['commerce.fake.sandbox_key' => 'secret-value']);
    $fields = (new FakeRedirectGateway)->settingsSchema();

    expect($fields[0]['instructions'])->toContain('FAKE_SANDBOX_KEY (set)', 'FAKE_KEY (missing)', '/commerce/webhooks/fake_redirect')
        ->not->toContain('secret-value');
});
