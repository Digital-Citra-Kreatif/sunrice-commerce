<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Event;
use Illuminate\Testing\TestResponse;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Events\QuoteRequested;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Promotions\Vouchers\VoucherRedemptions;
use Sunrice\Commerce\Promotions\Vouchers\VoucherUsage;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
});

/** The totals hash of what the cart would cost with this input. */
function seenHash(Cart $cart, array $input): string
{
    app()->forgetScopedInstances();

    return CartView::for($cart->fresh(), CheckoutData::fromCart($cart->fresh())->merge($input)->context())->state->hash();
}

function place(Cart $cart, array $input = []): TestResponse
{
    $input = checkoutInput($input);

    return test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)]);
}

it('places an order with snapshots, a payment and the timeline', function () {
    Event::fake([OrderPlaced::class]);
    $cart = cartWith([[$this->mug, 2]]);

    $response = place($cart);
    $order = Order::query()->sole();
    $response->assertRedirect($order->url());

    expect($order->status)->toBe('pending')->and($order->payment_status)->toBe('unpaid')->and($order->fulfillment_status)->toBe('unfulfilled')
        ->and($order->number)->toStartWith('ORD-')
        ->and($order->total)->toBe(110000)->and($order->shipping_total)->toBe(10000)->and($order->weight)->toBe(1000)
        ->and($order->shipping_address['city'])->toBe('Kota Bandung')
        ->and($order->phone)->toBe('+6281234567890')
        ->and($order->shipping_method['label'])->toBe('Reguler')
        ->and($order->payment_method_title)->toBe('Transfer')
        ->and($order->expires_at)->not->toBeNull()
        ->and($order->customer->email)->toBe('rina@example.com')
        ->and($order->user_id)->toBeNull();
    $item = $order->items->sole();
    expect($item->name)->toBe('Mug')->and($item->sku)->toBe('MUG')->and($item->quantity)->toBe(2)->and($item->unit_price)->toBe(50000)->and($item->subtotal)->toBe(100000);
    $payment = $order->payments->sole();
    expect($payment->amount)->toBe(110000)->and($payment->status)->toBe('pending')->and($payment->instructions)->toBe(['account' => '123', 'amount' => 110000]);
    expect($order->events->sole()->source)->toBe('storefront');
    expect($this->mug->fresh()->stock_quantity)->toBe(3);
    expect($cart->fresh()->status)->toBe('converted');
    Event::assertDispatched(OrderPlaced::class);

    $this->get($order->url())->assertOk()->assertSee($order->number)->assertSee('Rp110.000')->assertSee('Menunggu pembayaran')
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});

it('gives one order for a double submit', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $hash = seenHash($cart, $input);
    $data = CheckoutData::fromCart($cart)->merge($input);

    $first = app(PlaceOrder::class)->handle($cart, $data, $hash);
    $second = app(PlaceOrder::class)->handle($cart->fresh(), $data, $hash);
    expect($first->created)->toBeTrue()->and($second->created)->toBeFalse()->and($second->order->id)->toBe($first->order->id)
        ->and(Order::query()->count())->toBe(1)->and($this->mug->fresh()->stock_quantity)->toBe(4);
});

it('refuses to place when the price changed since the customer saw it, listing the change', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $hash = seenHash($cart, $input);
    $cart->items()->update(['unit_price_seen' => 50000]);
    Variant::query()->whereKey($this->mug->id)->update(['price' => 55000]);

    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => $hash])
        ->assertRedirect('/checkout')
        ->assertSessionHas('commerce.changes', fn ($changes) => str_contains(implode(' ', $changes), 'Rp55.000'));
    expect(Order::query()->count())->toBe(0)->and($this->mug->fresh()->stock_quantity)->toBe(5);
});

it('reserves stock, sale quantities and vouchers all or nothing', function () {
    $sale = FlashSale::query()->create(['name' => 'Payday', 'slug' => 'payday', 'starts_at' => now()->subHour(), 'ends_at' => now()->addHour()]);
    $item = $sale->items()->create(['product_id' => $this->mug->product_id, 'discount_type' => 'percent_off', 'discount_value' => 1000, 'quantity_limit' => 10]);
    $voucher = Voucher::query()->create(['name' => 'Hemat', 'code' => 'HEMAT', 'type' => 'fixed_cart', 'value' => 5000, 'usage_limit' => 1]);
    $cart = cartWith([[$this->mug, 2]]);
    $cart->update(['vouchers' => ['HEMAT']]);
    $input = checkoutInput();
    $hash = seenHash($cart, $input);

    // Another checkout took the last use between the calculation and the redemption: nothing is kept.
    app()->instance(VoucherRedemptions::class, new class(app(VoucherUsage::class)) extends VoucherRedemptions
    {
        public function redeem(Voucher $voucher, int $orderId, int $amount, PricingContext $ctx): bool
        {
            return false;
        }
    });
    expect(fn () => app(PlaceOrder::class)->handle($cart->fresh(), CheckoutData::fromCart($cart)->merge($input), $hash))
        ->toThrow(CheckoutRefused::class, 'HEMAT');
    expect(Order::query()->count())->toBe(0)
        ->and($this->mug->fresh()->stock_quantity)->toBe(5)
        ->and($item->fresh()->sold_quantity)->toBe(0)
        ->and($voucher->fresh()->times_used)->toBe(0)
        ->and($cart->fresh()->status)->toBe('active');

    app()->forgetInstance(VoucherRedemptions::class);
    $placed = app(PlaceOrder::class)->handle($cart->fresh(), CheckoutData::fromCart($cart)->merge($input), $hash);
    expect($this->mug->fresh()->stock_quantity)->toBe(3)
        ->and($item->fresh()->sold_quantity)->toBe(2)
        ->and($voucher->fresh()->times_used)->toBe(1)
        ->and($placed->order->items->sole()->flash_sale_item_id)->toBe($item->id)
        ->and($placed->order->total)->toBe(2 * 45000 - 5000 + 10000)
        ->and($placed->order->adjustments->where('kind', 'discount')->sole()->amount)->toBe(-5000)
        ->and($placed->order->meta('reserved'))->toMatchArray(['stock' => true, 'vouchers' => true]);
});

it('starts each selling mode in its states', function () {
    Event::fake([OrderPlaced::class, QuoteRequested::class, OrderPaid::class]);
    $settings = fn (array $v) => app(StoreSettings::class)->saveSection('general', $v);

    // Zero total: processing and paid, no payment row.
    $free = Variant::factory()->create(['product_id' => $this->mug->product_id, 'sku' => 'FREE', 'price' => 0, 'uid' => 'free', 'requires_shipping' => false]);
    $cart = cartWith([[$free, 1]]);
    place($cart, ['payment_method' => null]);
    $order = Order::query()->latest('id')->first();
    expect([$order->status, $order->payment_status, $order->fulfillment_status, $order->payments()->count()])->toBe(['processing', 'paid', 'not_required', 0]);
    Event::assertDispatched(OrderPaid::class);

    // Quotation: a quote, with a quote number and nothing reserved.
    $settings(['selling_mode' => 'quote']);
    $cart = cartWith([[$this->mug, 2]]);
    place($cart, ['payment_method' => null])->assertRedirect();
    $quote = Order::query()->latest('id')->first();
    expect([$quote->type, $quote->status, $quote->number, $this->mug->fresh()->stock_quantity])->toBe(['quote', 'requested', null, 5])
        ->and($quote->quote_number)->toStartWith('Q-');
    Event::assertDispatched(QuoteRequested::class);
    $this->get($quote->url())->assertOk()->assertSee($quote->quote_number);

    // WhatsApp: pending, arranged via WhatsApp, the order page opens WhatsApp.
    $settings(['selling_mode' => 'whatsapp', 'whatsapp' => ['numbers' => ['0812-1111-2222'], 'order_message' => ['id' => 'Halo, pesanan {order_number}: {items} Total {total}. {name}']]]);
    $cart = cartWith([[$this->mug, 1]]);
    place($cart, ['payment_method' => null])->assertRedirectContains('?whatsapp=1');
    $wa = Order::query()->latest('id')->first();
    expect([$wa->status, $wa->payment_method, $wa->payment_method_title])->toBe(['pending', 'whatsapp', 'Diatur lewat WhatsApp'])
        ->and($this->mug->fresh()->stock_quantity)->toBe(4)
        ->and(urldecode((string) $wa->meta('whatsapp_url')))->toStartWith('https://wa.me/6281211112222?text=Halo, pesanan '.$wa->number.': - 1 × Mug — Rp50.000 Total Rp60.000. Rina');
    $this->get($wa->url().'?whatsapp=1')->assertSee('wa.me/6281211112222', false);
});

it('shows the order page only by its key, and looks orders up by number and email', function () {
    $cart = cartWith([[$this->mug, 1]]);
    place($cart);
    $order = Order::query()->sole();

    $this->get('/order/'.str_repeat('x', 40))->assertNotFound();
    $this->get('/order/'.$order->id)->assertNotFound();

    $this->get('/track-order')->assertOk();
    $this->post('/track-order', ['number' => $order->number, 'email' => 'other@example.com'])->assertSessionHasErrors('number');
    $this->post('/track-order', ['number' => $order->number, 'email' => 'RINA@example.com'])->assertRedirect($order->url());
});

it('refuses orders while paused', function () {
    app(StoreSettings::class)->saveSection('general', ['pause_orders' => true, 'pause_message' => 'Libur Lebaran']);
    $cart = cartWith([[$this->mug, 1]]);
    place($cart)->assertRedirect('/checkout')->assertSessionHas('commerce.error', 'Libur Lebaran');
    expect(Order::query()->count())->toBe(0);
});

it('links guest orders once the email is verified', function () {
    $cart = cartWith([[$this->mug, 1]]);
    place($cart);
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'x']);
    expect(app(LinkGuestOrders::class)->handle($user))->toBe(1)
        ->and(Order::query()->sole()->user_id)->toBe($user->id);
});
