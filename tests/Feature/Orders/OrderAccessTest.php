<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    checkoutStore();
});

it('opens an order\'s pages for its account only', function () {
    $order = makeOrder(['total' => 100000]);
    $quote = makeOrder(['type' => 'quote', 'status' => 'requested', 'number' => null, 'quote_number' => 'Q-1', 'email' => 'buyer@example.com']);
    actAsOwnerOf($order, $quote);

    $this->get("/order/{$order->order_key}")->assertOk();
    $this->get("/order/{$order->order_key}/pay")->assertOk();
    $this->get("/quote/{$quote->order_key}")->assertOk();

    // Another account: the key in the address names the order, it doesn't open it.
    buyer('other@example.com', 'Other');
    foreach (["/order/{$order->order_key}", "/order/{$order->order_key}/pay", "/order/{$order->order_key}/invoice", "/quote/{$quote->order_key}", "/confirm-payment?order={$order->order_key}"] as $page) {
        $this->get($page)->assertNotFound();
    }
    $this->post("/order/{$order->order_key}/pay", ['payment_method' => 'test_transfer'])->assertNotFound();
    $this->post("/order/{$order->order_key}/cancel")->assertNotFound();
    $this->post("/quote/{$quote->order_key}/accept")->assertNotFound();
    $this->post('/confirm-payment', ['order' => $order->order_key])->assertNotFound();
});

it('sends a visitor to sign in, and back to the order', function () {
    $order = makeOrder();
    $owner = actAsOwnerOf($order);
    auth('account')->logout();

    $this->get("/order/{$order->order_key}")->assertRedirect('/account/login');
    $this->post('/account/login', ['email' => $owner->email, 'password' => 'secret-pass'])->assertRedirect("/order/{$order->order_key}");
    $this->get("/order/{$order->order_key}")->assertOk();
});

it('has no way to an order without its account: no tracking page, no lookup', function () {
    $order = makeOrder(['email' => 'nobody@example.com']);
    expect(User::query()->where('email', 'nobody@example.com')->exists())->toBeFalse();

    $this->get('/track-order')->assertNotFound();
    $this->get('/checkout/access')->assertNotFound();
    $this->get('/confirm-payment')->assertRedirect('/account/login');
});
