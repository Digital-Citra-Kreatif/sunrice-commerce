<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Reports\CustomersReport;
use Sunrice\Commerce\Analytics\Stats;
use Sunrice\Commerce\Analytics\StatsRecorder;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Customers\Actions\AnonymizeCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Loyalty\Loyalty;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Loyalty\Wallet;
use Sunrice\Commerce\Orders\Actions\EditOrder;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actions\TrashOrder;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Listeners\ReleaseReservations;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\PaymentResult;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
    app(ToggleFeature::class)->handle('loyalty', true);
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5]);
    $this->user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);
    $this->customer = Customer::forUser($this->user);
    $this->customer->save();
    $this->actingAs($this->user, 'commerce');
});

function placeAsRina(Cart $cart): Order
{
    $input = checkoutInput();
    test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();

    return Order::query()->latest('id')->firstOrFail();
}

function completeOrder(Order $order): Order
{
    if (! $order->isPaid() && $order->total > 0) {
        app(MarkOrderPaid::class)->handle($order, Actor::system());
    }
    app(OrderStateMachine::class)->transition($order->fresh(), OrderStatus::COMPLETED, Actor::system());

    return $order->fresh();
}

it('earns a share of the products after discounts when the order is completed, once', function () {
    $order = placeAsRina(cartWith([[$this->mug, 2]]));
    expect($this->customer->fresh()->loyalty_points)->toBe(0);

    completeOrder($order);
    // 5% of 2 × 50000 (shipping doesn't earn).
    expect($this->customer->fresh()->loyalty_points)->toBe(5000)
        ->and(app(Loyalty::class)->earn($order->fresh()))->toBe(0)
        ->and($this->customer->fresh()->loyalty_points)->toBe(5000);

    $this->get('/account/points')->assertOk()->assertSee('5.000');
});

it('leaves out excluded products, small orders and guests', function () {
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5, 'exclude' => [['type' => 'product', 'id' => $this->mug->product_id, 'label' => 'Mug']]]);
    completeOrder(placeAsRina(cartWith([[$this->mug, 1]])));
    expect($this->customer->fresh()->loyalty_points)->toBe(0);

    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5, 'exclude' => [], 'min_subtotal' => 200000]);
    completeOrder(placeAsRina(cartWith([[$this->mug, 1]])));
    expect($this->customer->fresh()->loyalty_points)->toBe(0);

    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5, 'min_subtotal' => 0]);
    $guest = makeOrder(['customer_id' => Customer::query()->create(['email' => 'guest@example.com'])->id, 'subtotal' => 100000, 'total' => 100000]);
    expect(app(Loyalty::class)->earnable($guest))->toBe(0);
});

it('pays with points after tax, takes them from the wallet, and gives them back when the order is cancelled', function () {
    app(Wallet::class)->credit($this->customer, 30000, 'adjust');
    $cart = cartWith([[$this->mug, 2]]);
    $this->post('/cart/points', ['use' => 1])->assertSessionHas('commerce.success');
    $this->get('/cart')->assertSee(__('commerce::storefront.cart.points_used'))->assertSee('-Rp30.000');

    $order = placeAsRina($cart->fresh());
    expect($order->total)->toBe(110000 - 30000)
        ->and($order->payments->sole()->amount)->toBe(80000)
        ->and($order->adjustments->where('kind', 'points')->sole()->amount)->toBe(-30000)
        ->and($this->customer->fresh()->loyalty_points)->toBe(0)
        ->and(app(EditOrder::class)->editable($order))->toBeFalse();

    app(ReleaseReservations::class)->release($order->fresh());
    app(ReleaseReservations::class)->release($order->fresh());
    expect($this->customer->fresh()->loyalty_points)->toBe(30000);
});

it('refuses an order once the points were spent elsewhere', function () {
    $state = new CalculationState(new PricingContext);
    $state->addAdjustment(new Adjustment('points', Adjustment::POINTS, 'Points', 5000, ['type' => 'points', 'id' => $this->customer->id]));
    app(Wallet::class)->credit($this->customer, 1000, 'adjust');

    expect(fn () => app(Loyalty::class)->commit(makeOrder(), $state))->toThrow(CheckoutRefused::class);
    expect($this->customer->fresh()->loyalty_points)->toBe(1000);
});

it('refunds money first, then onto the wallet, takes back what was earned, and counts points as spending', function () {
    app(Wallet::class)->credit($this->customer, 30000, 'adjust');
    $cart = cartWith([[$this->mug, 2]]);
    $cart->update(['checkout' => ['use_points' => true]]);
    $order = completeOrder(placeAsRina($cart->fresh()));
    // 5% of (100000 × 80000 / 110000): points don't earn points.
    expect($order->meta('loyalty.earned'))->toBe(3636)
        ->and($this->customer->fresh())->loyalty_points->toBe(3636)->total_spent->toBe(110000);

    app(StatsRecorder::class)->recompute(now()->toDateString());
    expect(app(Stats::class)->totals(now()->toDateString(), now()->toDateString())['total_sales'])->toBe(110000)
        ->and(app(CustomersReport::class)->run(Period::preset('today'))->rows[0]['spent'])->toBe(110000)
        ->and(app(TrashOrder::class)->canForceDelete($order))->toBeFalse();

    $refund = app(RecordRefund::class);
    expect(fn () => $refund->handle($order, 110001, [], null, false, Actor::system()))->toThrow(ValidationException::class);
    $refund->handle($order, 100000, [], null, false, Actor::system());
    expect($order->fresh())->refunded_total->toBe(80000)->status->toBe(OrderStatus::COMPLETED);
    // 20000 back onto the wallet, less the share of earned points the refund takes back.
    expect($this->customer->fresh()->loyalty_points)->toBe(3636 + 20000 - intdiv(3636 * 100000, 110000));

    $refund->handle($order->fresh(), 10000, [], null, false, Actor::system());
    expect($order->fresh()->status)->toBe(OrderStatus::REFUNDED)
        ->and($this->customer->fresh()->loyalty_points)->toBe(30000)
        ->and($this->customer->fresh()->total_spent)->toBe(0);
});

it('pays a whole order with points and refunds it back onto the wallet', function () {
    app(Wallet::class)->credit($this->customer, 200000, 'adjust');
    $cart = cartWith([[$this->mug, 2]]);
    $cart->update(['checkout' => ['use_points' => true]]);
    $order = placeAsRina($cart->fresh());
    expect($order->total)->toBe(0)->and($order->payment_status)->toBe(OrderStatus::PAID)
        ->and($this->customer->fresh()->loyalty_points)->toBe(90000);

    app(RecordRefund::class)->handle($order, 110000, [], null, false, Actor::system());
    expect($this->customer->fresh()->loyalty_points)->toBe(200000)
        ->and($order->fresh()->status)->toBe(OrderStatus::REFUNDED);
});

it('spends the points that expire first, and expires what is left in time', function () {
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5, 'expiry_days' => 30]);
    $wallet = app(Wallet::class);
    $wallet->credit($this->customer, 1000, 'adjust', expiresAt: now()->addYear());
    $wallet->credit($this->customer, 500, 'earn');           // expires in 30 days
    $wallet->debit($this->customer, 600, 'redeem');          // takes the 500 first, then 100

    $this->travel(31)->days();
    expect($wallet->expireDue())->toBe(0)
        ->and($this->customer->fresh()->loyalty_points)->toBe(900);

    $wallet->credit($this->customer, 200, 'earn');
    $this->travel(31)->days();
    expect($wallet->expireDue())->toBe(200)
        ->and($this->customer->fresh()->loyalty_points)->toBe(900)
        ->and(LoyaltyTransaction::query()->where('kind', 'expire')->sole()->points)->toBe(-200);
});

it('lets staff see and adjust points, never below zero, and forgets them on anonymizing', function () {
    actingAsUserWith(['commerce.customers.view']);
    $this->get('/admin/commerce/loyalty')->assertForbidden();
    actingAsUserWith(['commerce.loyalty.manage'], 'points@example.com');

    $this->put("/admin/commerce/loyalty/{$this->customer->id}", ['values' => ['points' => 2500, 'note' => 'Sorry for the delay']])->assertSessionHasNoErrors();
    $this->put("/admin/commerce/loyalty/{$this->customer->id}", ['values' => ['points' => -5000]])->assertSessionHasErrors('values.points');
    expect($this->customer->fresh()->loyalty_points)->toBe(2500);
    $this->get('/admin/commerce/loyalty')->assertOk()->assertInertia(fn ($p) => $p->where('rows.data.0.email', 'rina@example.com')->where('rows.data.0.loyalty_points', '2.500'));
    $this->get("/admin/commerce/loyalty/{$this->customer->id}")->assertOk();

    app(AnonymizeCustomer::class)->handle($this->customer->fresh());
    expect($this->customer->fresh()->loyalty_points)->toBe(0)
        ->and(LoyaltyTransaction::query()->value('note'))->toBeNull();

    app(ToggleFeature::class)->handle('loyalty', false);
    $this->get('/admin/commerce/loyalty')->assertNotFound();
});

it('earns on prices without the tax they include, and less what was refunded before completion', function () {
    $order = makeOrder(['customer_id' => $this->customer->id, 'user_id' => $this->user->id, 'status' => OrderStatus::PROCESSING, 'payment_status' => OrderStatus::PAID,
        'prices_include_tax' => true, 'subtotal' => 110000, 'total' => 110000, 'paid_total' => 110000, 'paid_at' => now()]);
    $order->items()->create(['name' => 'Mug', 'quantity' => 1, 'unit_price' => 110000, 'subtotal' => 110000, 'tax_total' => 10000, 'total' => 110000]);
    // 5% of 100000: the 10000 tax inside doesn't earn.
    expect(app(Loyalty::class)->earnable($order))->toBe(5000);

    $order->forceFill(['refunded_total' => 55000])->save();
    app(OrderStateMachine::class)->transition($order->fresh(), OrderStatus::COMPLETED, Actor::system());
    // Half of it was refunded while it was processing: half the points.
    expect($this->customer->fresh()->loyalty_points)->toBe(2500);
});

it('checks the minimum against the products, not a free-shipping discount', function () {
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 5, 'min_subtotal' => 100000]);
    $order = makeOrder(['customer_id' => $this->customer->id, 'user_id' => $this->user->id, 'subtotal' => 100000, 'discount_total' => 10000, 'shipping_total' => 10000, 'total' => 100000]);
    $order->items()->create(['name' => 'Mug', 'quantity' => 2, 'unit_price' => 50000, 'subtotal' => 100000, 'total' => 100000]);

    expect(app(Loyalty::class)->earnable($order))->toBe(5000);
});

it('takes points back when the payment provider reports a refund', function () {
    $order = completeOrder(placeAsRina(cartWith([[$this->mug, 2]])));
    expect($this->customer->fresh()->loyalty_points)->toBe(5000);

    // A gateway's webhook: half of what was paid comes back.
    app(RecordPaymentResult::class)->handle($order->payments()->sole(), PaymentResult::refunded(55000, 'gw-refund-1'));
    expect($this->customer->fresh()->loyalty_points)->toBe(2500);
});

it('works out a fractional rate exactly', function () {
    // 100,000 at 0.29% is 290 exactly; in floating point it comes to 289.99999999999994.
    app(StoreSettings::class)->saveSection('loyalty', ['earn_percent' => 0.29]);
    completeOrder(placeAsRina(cartWith([[$this->mug, 2]])));

    expect($this->customer->fresh()->loyalty_points)->toBe(290);
});
