<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Notifications\StoreEmail;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->mug = checkoutStore(['initial_stock' => 5]);
});

function placeMugs($mug, int $qty = 2)
{
    app()->forgetScopedInstances();
    $cart = cartWith([[$mug, $qty]]);

    return app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order->fresh();
}

it('gives back what a cancelled order still holds when its release did not run', function () {
    $order = placeMugs($this->mug);
    expect($this->mug->fresh()->stock_quantity)->toBe(3);

    // The release fails (here: never runs) when the order is cancelled.
    Event::fake([OrderCancelled::class]);
    app(OrderStateMachine::class)->transition($order, OrderStatus::CANCELLED, Actor::system());
    expect($this->mug->fresh()->stock_quantity)->toBe(3);

    $this->travel(2)->minutes();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');

    expect($this->mug->fresh()->stock_quantity)->toBe(5)
        ->and($order->fresh()->meta('released.done'))->toBeTrue();
});

it('leaves a released order alone', function () {
    $order = placeMugs($this->mug);
    app(OrderStateMachine::class)->transition($order, OrderStatus::CANCELLED, Actor::system());
    expect($order->fresh()->meta('released.done'))->toBeTrue();

    $this->travel(2)->minutes();
    $this->artisan('commerce:tick');

    expect($this->mug->fresh()->stock_quantity)->toBe(5);
});

it('reminds staff once of a payment confirmation waiting for review', function () {
    Notification::fake();
    app(StoreSettings::class)->saveSection('general', ['email' => 'toko@example.com']);
    $order = placeMugs($this->mug, 1);
    $confirmation = PaymentConfirmation::query()->forceCreate(['order_id' => $order->id, 'payment_id' => $order->payments->first()?->id, 'sender_name' => 'Rina',
        'amount' => $order->total, 'status' => 'submitted']);

    $this->artisan('commerce:tick');
    expect($confirmation->fresh()->reminded_at)->toBeNull();

    $this->travel(25)->hours();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');

    expect($confirmation->fresh()->reminded_at)->not->toBeNull()
        ->and($order->events()->pluck('message')->implode(' '))->toContain('waiting for review');
    $sent = 0;
    Notification::assertSentOnDemand(StoreEmail::class, function (StoreEmail $mail) use (&$sent) {
        $sent += $mail->key === 'staff_payment_confirmation' ? 1 : 0;

        return true;
    });
    expect($sent)->toBe(1);
});
