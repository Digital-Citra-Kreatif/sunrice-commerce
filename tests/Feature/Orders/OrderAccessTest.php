<?php

declare(strict_types=1);

use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Sunrice\Commerce\Notifications\GuestOrderCode;
use Workbench\App\Models\User;

beforeEach(function () {
    config(['honeypot.enabled' => false]);
});

it('requires the account owner for an account order and payment', function () {
    $owner = User::query()->create(['name' => 'Buyer', 'email' => 'buyer@example.com', 'password' => 'secret-pass']);
    $other = User::query()->create(['name' => 'Other', 'email' => 'other@example.com', 'password' => 'secret-pass']);
    $order = makeOrder(['user_id' => $owner->id]);
    $url = '/order/'.$order->order_key;

    $this->get($url)->assertNotFound();
    $this->get($url.'/pay')->assertNotFound();
    $this->actingAs($other, 'commerce')->get($url)->assertNotFound();

    $this->actingAs($owner, 'commerce')->get($url)->assertOk()
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertHeader('Referrer-Policy', 'no-referrer');
    $this->get($url.'/pay')->assertOk();
});

it('rejects unauthorised guest payment, confirmation, invoice and quote actions', function () {
    $order = makeOrder();
    $url = '/order/'.$order->order_key;
    $quote = makeOrder(['type' => 'quote', 'status' => 'quoted']);

    foreach ([$url, $url.'/pay', $url.'/invoice', $url.'/payment/return', '/quote/'.$quote->order_key, '/confirm-payment?order='.$order->order_key] as $page) {
        $this->get($page)->assertNotFound();
    }
    foreach ([$url.'/pay', $url.'/cancel', '/quote/'.$quote->order_key.'/accept', '/quote/'.$quote->order_key.'/decline'] as $action) {
        $this->post($action)->assertNotFound();
    }
    $this->post('/confirm-payment', ['order' => $order->order_key])->assertNotFound();
});

it('verifies a guest order by an emailed code and grants temporary access for that order', function () {
    Notification::fake();
    $order = makeOrder();
    $other = makeOrder();
    $this->post('/track-order', ['number' => $order->number, 'email' => 'unknown@example.com'])->assertRedirect('/track-order/code');
    Notification::assertNothingSent();
    $this->post('/track-order', ['number' => $order->number, 'email' => $order->email])->assertRedirect('/track-order/code');
    $code = Notification::sent(new AnonymousNotifiable, GuestOrderCode::class)->sole()->code;

    $this->from('/track-order/code')->post('/track-order/code', ['code' => '00000000'])->assertSessionHasErrors('code');
    $this->post('/track-order/code', ['code' => $code])->assertRedirect('/order/'.$order->order_key);
    $this->get('/order/'.$order->order_key)->assertOk();
    $this->get('/order/'.$other->order_key)->assertNotFound();
    $this->from('/track-order/code')->post('/track-order/code', ['code' => $code])->assertSessionHasErrors('code');
    $this->travel(61)->minutes();
    $this->get('/order/'.$order->order_key)->assertNotFound();
});

it('opens payment confirmation only after verifying the guest code', function () {
    Notification::fake();
    $order = makeOrder();
    $this->post('/confirm-payment/lookup', ['number' => $order->number, 'email' => $order->email])->assertRedirect('/track-order/code');
    $code = Notification::sent(new AnonymousNotifiable, GuestOrderCode::class)->sole()->code;
    $this->post('/track-order/code', ['code' => $code])->assertRedirect('/confirm-payment?order='.$order->order_key);
    $this->get('/confirm-payment?order='.$order->order_key)->assertOk();
});
