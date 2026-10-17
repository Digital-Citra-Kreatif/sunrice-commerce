<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Auth;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    $this->mug = checkoutStore();
    $this->user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => bcrypt('password'), 'email_verified_at' => now()]);
});

function guestOrder(Variant $variant, string $email): Order
{
    $cart = cartWith([[$variant, 1]]);

    return app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput(['email' => $email])), null)->order;
}

it('shows customers only their own orders, linked guest orders after verification', function () {
    $mine = guestOrder($this->mug, 'rina@example.com');
    $other = guestOrder($this->mug, 'budi@example.com');
    Auth::guard('commerce')->login($this->user);

    $this->get('/account/orders')->assertOk()->assertDontSee($mine->number);
    app(LinkGuestOrders::class)->handle($this->user);
    $this->get('/account/orders')->assertOk()->assertSee($mine->number)->assertDontSee($other->number);
    $this->get("/account/orders/{$mine->id}")->assertOk()->assertSee('Rp60.000');
    $this->get("/account/orders/{$other->id}")->assertNotFound();
});

it('buys again what is still available', function () {
    $tea = Variant::factory()->create(['product_id' => $this->mug->product_id, 'sku' => 'TEA', 'price' => 20000, 'uid' => 'tea']);
    $cart = cartWith([[$this->mug, 1], [$tea, 2]]);
    $order = app(PlaceOrder::class)->handle($cart, CheckoutData::fromCart($cart)->merge(checkoutInput()), null)->order;
    app(LinkGuestOrders::class)->handle($this->user);
    $tea->delete();
    Auth::guard('commerce')->login($this->user);

    $this->post("/account/orders/{$order->id}/again")->assertRedirect('/cart')->assertSessionHas('commerce.error', fn ($m) => str_contains($m, 'Mug (') === false && str_contains($m, 'TEA') === false);
    expect(Cart::query()->where('status', 'active')->latest('id')->first()->items->pluck('quantity', 'variant_id')->all())->toBe([$this->mug->id => 1]);
});

it('cancels from the account only while unpaid', function () {
    $order = guestOrder($this->mug, 'rina@example.com');
    app(LinkGuestOrders::class)->handle($this->user);
    Auth::guard('commerce')->login($this->user);
    $this->get("/account/orders/{$order->id}")->assertSee("/account/orders/{$order->id}/cancel", false);

    app(RecordPaymentResult::class)->handle($order->payments->sole(), PaymentResult::paid());
    $this->post("/account/orders/{$order->id}/cancel")->assertSessionHas('commerce.error');
    expect($order->fresh()->status)->toBe('processing');
});

it('scrubs a customer\'s orders when the account is anonymized, keeping the amounts', function () {
    $order = guestOrder($this->mug, 'rina@example.com');
    app(AnonymizeCustomer::class)->handle(Customer::query()->where('email', 'rina@example.com')->firstOrFail());
    $order->refresh();
    expect($order->customer_name)->toBe('Deleted customer')->and($order->shipping_address)->toBeNull()->and($order->phone)->toBeNull()
        ->and($order->email)->toEndWith('@invalid.local')->and($order->total)->toBe(60000);
});
