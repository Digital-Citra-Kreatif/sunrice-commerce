<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Admin\Dashboard\DashboardCards;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Actions\CreateShipment;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Commerce\Shipping\ShipmentTracker;
use Workbench\App\Commerce\FakeCourier;
use Workbench\App\Commerce\FakeLoyalty;
use Workbench\App\Models\User;

/*
 * The reference fakes in workbench/app/Commerce run whole orders
 * (EXECUTION_PLAN.md C15.2). FakeGateway's order, webhook and refund
 * flow is in tests/Feature/Payments/GatewayTest.php.
 */

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    config(['honeypot.enabled' => false]);
    $this->mug = checkoutStore();
});

function placeOrder(array $input = []): Order
{
    $cart = cartWith([[test()->mug, 2]]);
    $input = checkoutInput($input);
    test()->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => seenHash($cart, $input)])->assertRedirect();

    return Order::query()->latest('id')->firstOrFail();
}

it('ships with a courier extension: live rates, then tracking until delivered', function () {
    app(Commerce::class)->registerShippingMethodType(FakeCourier::class);
    $method = ShippingZone::query()->firstOrFail()->methods()->create(['type' => 'fake_courier', 'title' => ['id' => 'Kurir', 'en' => 'Courier'], 'settings' => ['per_kg' => 9000], 'active' => true]);

    $order = placeOrder(['shipping_rate' => "fake_courier:{$method->id}:YES"]);
    expect($order->shipping_total)->toBe(18000)                 // 1 kg, YES at twice REG
        ->and($order->shipping_method['label'])->toBe('Fake courier YES');

    app(MarkOrderPaid::class)->handle($order, Actor::system());
    $item = $order->items()->sole();
    $parcel = app(CreateShipment::class)->handle($order->refresh(), ['courier_name' => 'Fake courier', 'tracking_number' => 'FC1'], [['order_item_id' => $item->id, 'quantity' => 2]], Actor::system());

    expect(app(ShipmentTracker::class)())->toBe(1);
    expect($parcel->refresh()->status)->toBe('in_transit')->and($parcel->meta['tracking']['history'])->toHaveCount(1)
        ->and(app(ShipmentTracker::class)())->toBe(0);         // checked less than an hour ago

    $parcel->forceFill(['tracking_number' => 'FC1-DLV'])->save();
    $this->travel(61)->minutes();
    $this->artisan('commerce:tick')->assertSuccessful();
    expect($parcel->refresh()->status)->toBe('delivered')->and($parcel->delivered_at)->not->toBeNull();
});

it('runs a loyalty extension: spend, release, earn and reverse points', function () {
    FakeLoyalty::register();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => bcrypt('password'), 'email_verified_at' => now()]);
    $this->actingAs($user, 'commerce');
    $customer = Customer::forUser($user);
    DB::table('loyalty_ledger')->insert(['customer_id' => $customer->id, 'points' => 300, 'reason' => 'earn', 'created_at' => now(), 'updated_at' => now()]);

    // The checkout slot offers the points; using them is the customer's choice.
    cartWith([[$this->mug, 2]]);
    $this->get('/checkout')->assertOk()->assertSee('You have 300 points.')->assertSee('Use my points');
    $this->post('/loyalty/use', ['use' => 1])->assertRedirect();

    // 300 points = Rp30.000 off, reserved when the order is placed.
    $first = placeOrder();
    expect($first->discount_total)->toBe(30000)->and($first->total)->toBe(100000 - 30000 + 10000)
        ->and(FakeLoyalty::balance($customer->id))->toBe(0);

    // Cancelling gives the points back.
    app(OrderStateMachine::class)->transition($first, 'cancelled', Actor::system());
    expect(FakeLoyalty::balance($customer->id))->toBe(300);

    // A paid order earns a point per Rp1.000; refunds and cancellation take them back.
    $customer->refresh()->forceFill(['meta' => ['loyalty_use' => false]])->save();
    $second = placeOrder();
    app(MarkOrderPaid::class)->handle($second, Actor::system());
    expect(FakeLoyalty::balance($customer->id))->toBe(300 + 110);

    app(RecordRefund::class)->handle($second->refresh(), 50000, [], 'Damaged', false, Actor::system());
    expect(FakeLoyalty::balance($customer->id))->toBe(300 + 110 - 50);
    app(RecordRefund::class)->handle($second->refresh(), 60000, [], 'Returned', false, Actor::system());
    expect($second->refresh()->status)->toBe('refunded')->and(FakeLoyalty::balance($customer->id))->toBe(300);

    // My Account page and the dashboard widget.
    $this->get('/account/points')->assertOk()->assertSee('300 points');
    expect(app(DashboardCards::class)->widgets(actingAsSuperAdmin()))->toMatchArray(['loyalty-points' => ['issued' => 410, 'redeemed' => 300]]);
});

it('refuses an order when the points are gone by the time it is placed', function () {
    FakeLoyalty::register();
    $user = User::query()->create(['name' => 'Rina', 'email' => 'rina@example.com', 'password' => bcrypt('password'), 'email_verified_at' => now()]);
    $this->actingAs($user, 'commerce');
    $customer = Customer::forUser($user);
    $customer->forceFill(['meta' => ['loyalty_use' => true]])->save();
    DB::table('loyalty_ledger')->insert(['customer_id' => $customer->id, 'points' => 100, 'reason' => 'earn', 'created_at' => now(), 'updated_at' => now()]);

    $cart = cartWith([[$this->mug, 1]]);
    $input = checkoutInput();
    $hash = seenHash($cart, $input);
    // Spent elsewhere between showing the checkout and placing.
    expect(app(FakeLoyalty::class))->toBeInstanceOf(FakeLoyalty::class);
    DB::table('loyalty_ledger')->insert(['customer_id' => $customer->id, 'points' => -100, 'reason' => 'redeem', 'created_at' => now(), 'updated_at' => now()]);
    $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => $hash])->assertRedirect();

    expect(Order::query()->count())->toBe(0);
});
