<?php

declare(strict_types=1);

use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\LineDetails;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Commerce;

// Checkout is for accounts: these tests shop signed in (as Rina, unless a test signs someone else in).
beforeEach(fn () => buyer());

beforeEach(function () {
    $this->mug = checkoutStore();
    app(Commerce::class)->describeLinesUsing(fn (array $meta) => isset($meta['engraving']) ? ['Engraving: '.$meta['engraving']] : []);
});

it('shows what a line\'s meta means in the cart, at checkout and on the order', function () {
    app(AddToCart::class)->handle($this->mug->id, 1, ['engraving' => 'Rina']);
    $cart = app(CartManager::class)->current();
    $this->withCookie('commerce_cart', $cart->token);

    $this->get('/cart')->assertOk()->assertSee('Engraving: Rina');
    $this->get('/checkout')->assertOk()->assertSee('Engraving: Rina');

    app()->forgetScopedInstances();
    $order = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order;
    $item = $order->items->sole();
    expect($item->details())->toBe(['Engraving: Rina']);
    actAsOwnerOf($order);
    $this->get($order->url())->assertSee('Engraving: Rina');

    actingAsSuperAdmin();
    $this->get("/admin/commerce/orders/{$order->id}")->assertOk()
        ->assertInertia(fn ($page) => $page->where('order.items.0.details', ['Engraving: Rina']));
});

it('keeps going when a describer fails, and says nothing without meta', function () {
    app(Commerce::class)->describeLinesUsing(fn (array $meta) => throw new RuntimeException('broken'));

    expect(app(LineDetails::class)->for(['engraving' => 'A']))->toBe(['Engraving: A'])
        ->and(app(LineDetails::class)->for(null))->toBe([])
        ->and(app(LineDetails::class)->for([]))->toBe([]);
});
