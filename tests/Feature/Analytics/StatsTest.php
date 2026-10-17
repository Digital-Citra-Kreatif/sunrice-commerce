<?php

declare(strict_types=1);

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\StatsRecorder;
use Sunrice\Commerce\Analytics\StatsTracking;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Contracts\Tracking;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\Refund;

function dayRow(string $date): ?object
{
    return DB::table('commerce_stats_daily')->where('date', $date)->first();
}

/** A paid order with one line of the given product. */
function soldOrder(int $productId, int $quantity, int $unit, array $attributes = []): Order
{
    $order = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'subtotal' => $quantity * $unit, 'total' => $quantity * $unit, 'paid_total' => $quantity * $unit, ...$attributes]);
    $order->items()->create(['product_id' => $productId, 'name' => 'Item', 'quantity' => $quantity, 'unit_price' => $unit, 'subtotal' => $quantity * $unit, 'total' => $quantity * $unit]);

    return $order;
}

beforeEach(function () {
    $this->travelTo('2026-03-10 12:00:00');
    $this->mug = checkoutStore();
    $this->productId = (int) $this->mug->product_id;
});

it('recomputes a day idempotently from the orders', function () {
    soldOrder($this->productId, 2, 50000, ['shipping_total' => 10000, 'total' => 110000, 'discount_total' => 5000]);
    soldOrder($this->productId, 1, 50000);
    makeOrder(['subtotal' => 999999, 'total' => 999999]);                                    // unpaid: not counted
    makeOrder(['status' => 'processing', 'payment_status' => 'unpaid', 'subtotal' => 20000, 'total' => 20000]); // cash on delivery: counted
    makeOrder(['type' => 'quote', 'status' => 'requested', 'number' => null, 'placed_at' => null]);

    $recorder = app(StatsRecorder::class);
    $recorder->recompute('2026-03-10');
    $first = (array) dayRow('2026-03-10');
    $recorder->recompute('2026-03-10');
    $recorder->recompute('2026-03-10');

    expect((array) dayRow('2026-03-10'))->toBe($first)
        ->and($first)->toMatchArray(['orders' => 3, 'items_sold' => 3, 'gross_sales' => 170000, 'discounts' => 5000, 'refunds' => 0,
            'net_sales' => 165000, 'shipping' => 10000, 'total_sales' => 180000, 'quotes_requested' => 1])
        ->and(DB::table('commerce_product_stats_daily')->where('date', '2026-03-10')->where('product_id', $this->productId)->first())
        ->units_sold->toBe(3)->revenue->toBe(150000)
        ->and(DB::table('commerce_stats_daily')->count())->toBe(1);
});

it('counts refunds on their own date and drops cancelled orders', function () {
    $order = soldOrder($this->productId, 2, 50000);
    $this->travelTo('2026-03-12 09:00:00');
    Refund::query()->create(['order_id' => $order->id, 'amount' => 30000, 'status' => 'completed']);
    $recorder = app(StatsRecorder::class);
    $recorder->rebuild('2026-03-10', '2026-03-12');

    expect(dayRow('2026-03-10'))->gross_sales->toBe(100000)->refunds->toBe(0)->net_sales->toBe(100000)
        ->and(dayRow('2026-03-12'))->orders->toBe(0)->refunds->toBe(30000)->net_sales->toBe(-30000);

    $order->forceFill(['status' => 'cancelled'])->save();
    $recorder->rebuild('2026-03-10', '2026-03-12');

    expect(dayRow('2026-03-10'))->orders->toBe(0)->gross_sales->toBe(0)
        ->and(dayRow('2026-03-12'))->refunds->toBe(0)
        ->and(DB::table('commerce_product_stats_daily')->where('date', '2026-03-10')->value('units_sold'))->toBe(0);
});

it('tells new customers from returning ones', function () {
    $ani = Customer::query()->create(['email' => 'ani@example.com']);
    $budi = Customer::query()->create(['email' => 'budi@example.com']);
    soldOrder($this->productId, 1, 50000, ['customer_id' => $ani->id, 'placed_at' => now()->subDays(3)]);
    soldOrder($this->productId, 1, 50000, ['customer_id' => $ani->id]);
    soldOrder($this->productId, 1, 50000, ['customer_id' => $budi->id]);
    soldOrder($this->productId, 1, 50000, ['customer_id' => $budi->id]);
    app(StatsRecorder::class)->recompute('2026-03-10');

    expect(dayRow('2026-03-10'))->new_customers->toBe(1)->returning_customers->toBe(1);
});

it('uses the site timezone for day boundaries', function () {
    config(['app.timezone' => 'Asia/Jakarta']);
    date_default_timezone_set('Asia/Jakarta');
    $this->travelTo(Carbon::parse('2026-03-10 23:30:00', 'Asia/Jakarta'));
    soldOrder($this->productId, 1, 50000);                // 23:30 local on the 10th (16:30 UTC)
    $this->travelTo(Carbon::parse('2026-03-11 00:10:00', 'Asia/Jakarta'));
    soldOrder($this->productId, 1, 70000);                // 00:10 local on the 11th (17:10 UTC on the 10th)
    app(StatsRecorder::class)->rebuild('2026-03-10', '2026-03-11');

    expect(dayRow('2026-03-10'))->gross_sales->toBe(50000)
        ->and(dayRow('2026-03-11'))->gross_sales->toBe(70000);
    date_default_timezone_set('UTC');
});

it('recomputes when orders change, through the queue', function () {
    $order = makeOrder(['subtotal' => 80000, 'total' => 80000]);
    expect(dayRow('2026-03-10'))->toBeNull();
    $order->forceFill(['payment_status' => 'paid', 'status' => 'processing'])->save();
    OrderPaid::dispatch($order);

    expect(dayRow('2026-03-10'))->orders->toBe(1)->gross_sales->toBe(80000);
});

it('counts views, add-to-carts, clicks and checkouts, but not bots or staff', function () {
    $this->get('/products/mug', ['User-Agent' => 'Mozilla/5.0 Firefox'])->assertOk();
    $this->get('/products/mug', ['User-Agent' => 'Mozilla/5.0 Firefox'])->assertOk();
    $this->get('/products/mug', ['User-Agent' => 'Googlebot/2.1'])->assertOk();
    $this->get('/products/mug', ['User-Agent' => ''])->assertOk();
    $this->post('/cart/items', ['variant' => $this->mug->id, 'quantity' => 1], ['User-Agent' => 'Mozilla/5.0 Firefox']);
    $this->withHeader('User-Agent', 'Mozilla/5.0 Firefox')->get('/go/inquiry/'.Product::query()->find($this->productId)->entry_id)->assertRedirect();
    cartWith([[$this->mug, 1]]);
    $this->withHeader('User-Agent', 'Mozilla/5.0 Firefox')->get('/checkout')->assertOk();
    actingAsSuperAdmin();
    $this->get('/products/mug', ['User-Agent' => 'Mozilla/5.0 Firefox'])->assertOk();

    $row = DB::table('commerce_product_stats_daily')->where('date', '2026-03-10')->where('product_id', $this->productId)->first();
    expect($row->views)->toBe(2)
        ->and($row->add_to_carts)->toBe(1)
        ->and($row->cta_inquiry)->toBe(1)
        ->and(dayRow('2026-03-10'))->carts_created->toBe(1)->checkouts_started->toBe(1);

    // A recompute keeps the counters.
    app(StatsRecorder::class)->recompute('2026-03-10');
    expect(DB::table('commerce_product_stats_daily')->where('product_id', $this->productId)->value('views'))->toBe(2);
});

it('skips views when tracking is off', function () {
    config(['commerce.analytics.track_views' => false]);
    $this->get('/products/mug', ['User-Agent' => 'Mozilla/5.0 Firefox'])->assertOk();

    expect(DB::table('commerce_product_stats_daily')->sum('views'))->toBe(0);
});

it('rebuilds history from the console', function () {
    soldOrder($this->productId, 1, 50000, ['placed_at' => now()->subDays(5), 'created_at' => now()->subDays(5)]);

    $this->artisan('commerce:stats', ['--rebuild' => true])->assertSuccessful();
    expect(DB::table('commerce_stats_daily')->count())->toBe(6)
        ->and(dayRow('2026-03-05')->orders)->toBe(1);
    $this->artisan('commerce:stats', ['--from' => 'yesterday'])->assertFailed();
    expect(app(Tracking::class))->toBeInstanceOf(StatsTracking::class);
});
