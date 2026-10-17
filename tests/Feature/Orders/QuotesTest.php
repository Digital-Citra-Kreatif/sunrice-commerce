<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Event;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Events\QuoteAccepted;
use Sunrice\Commerce\Orders\Events\QuoteSent;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $this->mug = checkoutStore();
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'quote']);
    app()->forgetScopedInstances();
    $cart = cartWith([[$this->mug, 2]]);
    $this->quote = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput(['payment_method' => null, 'shipping_rate' => null])), null)->order;
});

it('reserves nothing and has no order number until accepted', function () {
    Event::fake([QuoteSent::class, QuoteAccepted::class]);
    expect([$this->quote->type, $this->quote->status, $this->quote->number])->toBe(['quote', 'requested', null])
        ->and($this->mug->fresh()->stock_quantity)->toBe(5);

    actingAsUserWith(['commerce.orders.view', 'commerce.quotes.respond']);
    $item = $this->quote->items->sole();
    $this->get("/cms/commerce/orders/{$this->quote->id}/quote")->assertOk()->assertInertia(fn ($p) => $p->component('Commerce/Orders/Editor')->where('mode', 'quote'));
    $this->put("/cms/commerce/orders/{$this->quote->id}/quote", [
        'lines' => [['item_id' => $item->id, 'variant_id' => $this->mug->id, 'quantity' => 2, 'unit_price' => 45000]],
        'shipping' => ['label' => 'Truk', 'cost' => 25000], 'valid_until' => now()->addDays(7)->toDateString(),
    ])->assertRedirect();
    $quote = $this->quote->fresh();
    expect([$quote->status, $quote->total, $quote->number])->toBe(['quoted', 90000 + 25000, null])
        ->and($this->mug->fresh()->stock_quantity)->toBe(5);
    Event::assertDispatched(QuoteSent::class);

    // A later price change doesn't touch what was quoted.
    Variant::query()->whereKey($this->mug->id)->update(['price' => 70000]);
    $this->get($quote->url())->assertOk()->assertSee('Rp115.000');
    $this->post("/quote/{$quote->order_key}/accept")->assertRedirect();
    $order = $quote->fresh();
    expect([$order->type, $order->status, $order->payment_status, $order->total])->toBe(['order', 'pending', 'unpaid', 115000])
        ->and($order->number)->toStartWith('ORD-')->and($order->quote_number)->toStartWith('Q-')
        ->and($order->items->sole()->unit_price)->toBe(45000)
        ->and($this->mug->fresh()->stock_quantity)->toBe(3);
    Event::assertDispatched(QuoteAccepted::class);
    $this->get("/quote/{$order->order_key}")->assertRedirect($order->url());
});

it('refuses accepting an expired quote and expires it from the tick', function () {
    actingAsUserWith(['commerce.orders.view', 'commerce.quotes.respond']);
    $item = $this->quote->items->sole();
    $this->put("/cms/commerce/orders/{$this->quote->id}/quote", ['lines' => [['item_id' => $item->id, 'variant_id' => $this->mug->id, 'quantity' => 2]], 'valid_until' => now()->toDateString()]);

    $this->travel(2)->days();
    $this->post("/quote/{$this->quote->order_key}/accept")->assertSessionHas('commerce.error');
    expect($this->quote->fresh()->type)->toBe('quote');
    $this->artisan('commerce:tick');
    expect($this->quote->fresh()->status)->toBe('expired');
});

it('lets the customer decline', function () {
    $this->post("/quote/{$this->quote->order_key}/decline")->assertSessionHas('commerce.success');
    expect($this->quote->fresh()->status)->toBe('declined')->and(Order::query()->sole()->number)->toBeNull();
});
