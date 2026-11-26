<?php

declare(strict_types=1);

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\TestResponse;
use Sunrice\Account\Notifications\LoginCodeNotification;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Inventory\DatabaseInventory;
use Sunrice\Commerce\Inventory\OutOfStock;
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

// Checkout is for accounts: these tests shop signed in (as Rina, unless a test signs someone else in).
beforeEach(fn () => buyer());

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
});

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
        // Every order belongs to the account that placed it.
        ->and($order->user_id)->toBe(auth('account')->id());
    $item = $order->items->sole();
    expect($item->name)->toBe('Mug')->and($item->sku)->toBe('MUG')->and($item->quantity)->toBe(2)->and($item->unit_price)->toBe(50000)->and($item->subtotal)->toBe(100000);
    $payment = $order->payments->sole();
    expect($payment->amount)->toBe(110000)->and($payment->status)->toBe('pending')->and($payment->instructions)->toEqual(['account' => '123', 'amount' => 110000]);
    expect($order->events->sole()->source)->toBe('storefront');
    expect($this->mug->fresh()->stock_quantity)->toBe(3);
    expect($cart->fresh()->status)->toBe('converted');
    Event::assertDispatched(OrderPlaced::class);

    $this->get($order->url())->assertOk()->assertSee($order->number)->assertSee('Rp110.000')->assertSee('Menunggu pembayaran')
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});

it('uses the shipping recipient as the order contact for a delivery', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput(['shipping_address' => ['name' => 'Dewi Penerima', 'phone' => '081298765432']]);
    unset($input['name'], $input['phone']);

    $page = $this->get('/checkout')->assertOk();
    preg_match('/<fieldset[^>]+id="contact"[^>]*>(.*?)<\/fieldset>/s', (string) $page->getContent(), $section);
    expect($section[1])->toContain('name="email"')->not->toContain('name="name"', 'name="phone"');

    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])
        ->assertSessionHasNoErrors();
    $order = Order::query()->sole();
    expect($order->customer_name)->toBe('Dewi Penerima')
        ->and($order->phone)->toBe('+6281298765432')
        ->and($order->shipping_address['name'])->toBe('Dewi Penerima');
});

it('requires a configured captcha only for final order placement', function () {
    config(['sunrice-admin.captcha' => ['provider' => 'turnstile', 'site_key' => 'site', 'secret_key' => 'secret']]);
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::sequence()
            ->push(['success' => false])->push(['success' => true]),
    ]);
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $this->get('/checkout')->assertOk()->assertSee('class="cf-turnstile"', false);
    $this->withCredentials()->postJson('/checkout/refresh', $input)->assertOk();
    $this->post('/checkout', [...$input, 'action' => 'update'])->assertRedirect('/checkout#shipping');
    Http::assertNothingSent();

    $post = [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)];
    $this->post('/checkout', $post)->assertRedirect('/checkout#checkout-captcha')->assertSessionHasErrors('captcha');
    $this->post('/checkout', [...$post, 'cf-turnstile-response' => 'expired-token'])->assertSessionHasErrors('captcha');
    expect(Order::query()->count())->toBe(0);

    $this->post('/checkout', [...$post, 'cf-turnstile-response' => 'checkout-token'])->assertSessionHasNoErrors();
    expect(Order::query()->count())->toBe(1);
    Http::assertSentCount(2);
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

it('tells the customer which product ran out, not the variant id, when stock goes before placing', function () {
    $cart = cartWith([[$this->mug, 2]]);
    app()->setLocale('id');
    $input = checkoutInput();
    $hash = seenHash($cart, $input);
    // Another order took the stock between the calculation and the reservation.
    app()->instance(Inventory::class, new class extends DatabaseInventory
    {
        public function reserve(array $lines, ?Model $reference = null, string $reason = 'order'): void
        {
            throw new OutOfStock($lines[0][0], 2, 1);
        }
    });

    expect(fn () => app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge($input), $hash))
        ->toThrow(CheckoutRefused::class, 'Stok Mug tinggal 1.');
    expect(Order::query()->count())->toBe(0);

    app()->setLocale('en');
    expect((new OutOfStock($this->mug, 2, 0))->customerMessage())->toBe('Mug is out of stock.');
    $this->mug->product->forceFill(['entry_id' => null]);
    expect((new OutOfStock($this->mug, 2, 0))->customerMessage())->toBe(__('commerce::storefront.availability.stock_changed'));
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

it('refuses orders while paused', function () {
    app(StoreSettings::class)->saveSection('general', ['pause_orders' => true, 'pause_message' => 'Libur Lebaran']);
    $cart = cartWith([[$this->mug, 1]]);
    place($cart)->assertRedirect('/checkout')->assertSessionHas('commerce.error', 'Libur Lebaran');
    expect(Order::query()->count())->toBe(0);
});

it('skips shipping for existing downloadable variants with shipping flags still set', function () {
    $this->mug->update(['downloadable' => true, 'requires_shipping' => true]);
    $cart = cartWith([[$this->mug, 3]]);
    $cart->items()->create(['variant_id' => $this->mug->id, 'quantity' => 1, 'meta' => ['legacy' => true]]);

    place($cart, ['shipping_address' => null, 'shipping_method' => null])->assertSessionHasNoErrors();
    $order = Order::query()->sole();
    expect($order->shipping_address)->toBeNull()
        ->and($order->shipping_method)->toBeNull()
        ->and($order->shipping_total)->toBe(0)
        ->and($order->items->sole()->requires_shipping)->toBeFalse()
        ->and($order->items->sole()->downloadable)->toBeTrue()
        ->and($order->items->sole()->quantity)->toBe(1);
});

it('places the order for the signed-in account, whatever address the form sends', function () {
    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $rina = auth('account')->user();

    $this->post('/checkout', [...$input, 'email' => 'someone.else@example.com', 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertSessionHasNoErrors();

    $order = Order::query()->sole();
    expect([$order->email, $order->user_id])->toBe(['rina@example.com', $rina->id])
        ->and($order->customer->user_id)->toBe($rina->id);
    $this->get($order->url())->assertOk()->assertSee($order->number);
});

it('sends a visitor from checkout to sign in, and back with the cart', function () {
    auth('account')->logout();
    $cart = cartWith([[$this->mug, 2]]);

    $this->get('/checkout')->assertRedirect('/account/login');
    $this->post('/checkout', ['action' => 'place'])->assertRedirect('/account/login');
    expect(Order::query()->count())->toBe(0);

    // One field: the emailed code makes the account and comes back to checkout, the cart with them.
    Notification::fake();
    $this->get('/checkout');
    $this->post('/account/login/code', ['email' => 'new.buyer@example.com'])->assertRedirect('/account/login/code');
    $code = '';
    Notification::assertSentOnDemand(LoginCodeNotification::class, function (LoginCodeNotification $n) use (&$code) {
        $code = $n->code;

        return true;
    });
    $this->post('/account/login/code/check', ['code' => $code])->assertRedirect('/checkout');

    $this->get('/checkout')->assertOk()->assertSee('new.buyer@example.com');
    expect($cart->fresh()->customer_id)->toBe(Customer::query()->where('email', 'new.buyer@example.com')->value('id'))
        ->and($cart->fresh()->items->sole()->quantity)->toBe(2);
});
