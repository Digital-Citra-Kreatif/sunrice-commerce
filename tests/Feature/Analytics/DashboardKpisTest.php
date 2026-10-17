<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Admin\Dashboard\StoreCard;
use Sunrice\Commerce\Analytics\StatsRecorder;

beforeEach(function () {
    $this->travelTo('2026-03-10 12:00:00');
    $this->mug = checkoutStore();
});

function paidOrder(int $productId, int $total, string $placedAt, int $quantity = 1): void
{
    $order = makeOrder(['status' => 'processing', 'payment_status' => 'paid', 'subtotal' => $total, 'total' => $total, 'paid_total' => $total, 'placed_at' => $placedAt, 'created_at' => $placedAt]);
    $order->items()->create(['product_id' => $productId, 'name' => 'Mug', 'quantity' => $quantity, 'unit_price' => intdiv($total, $quantity), 'subtotal' => $total, 'total' => $total]);
}

it('shows sales figures against the previous period, a chart and top products', function () {
    $product = (int) $this->mug->product_id;
    paidOrder($product, 100000, '2026-03-10 09:00:00', 2);      // this week
    paidOrder($product, 50000, '2026-03-05 09:00:00');          // this week
    paidOrder($product, 60000, '2026-03-01 09:00:00');          // the week before
    makeOrder(['subtotal' => 999999, 'total' => 999999]);         // unpaid
    app(StatsRecorder::class)->rebuild('2026-02-25', '2026-03-10');
    actingAsUserWith(['commerce.dashboard.view', 'commerce.orders.view']);

    $this->get('/cms/commerce?period=7d')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
        ->where('period.key', '7d')
        ->missing('kpis')
        ->loadDeferredProps('figures', fn (AssertableInertia $page) => $page
            ->where('kpis.0.key', 'total_sales')
            ->where('kpis.0.raw', 150000)
            ->where('kpis.0.previous', 60000)
            ->where('kpis.0.change', 150)
            ->where('kpis.1.raw', 2)                      // orders
            ->where('kpis.2.raw', 75000)                  // average order value
            ->where('kpis.3.raw', 3)                      // items sold
            ->has('sales', 7)
            ->where('sales.6.date', '2026-03-10')
            ->where('sales.6.total', 100000)
            ->where('sales.6.previous', 0)
            ->where('topProducts.0.units', 3)
            ->where('topProducts.0.title', 'Mug'))
        ->loadDeferredProps('lists', fn (AssertableInertia $page) => $page
            ->has('recentOrders', 4)
            ->where('todo', fn ($todo) => collect($todo)->firstWhere('key', 'to_ship')['count'] === 3)));

    $this->get('/cms/commerce?period=today')->assertInertia(fn (AssertableInertia $page) => $page
        ->loadDeferredProps('figures', fn (AssertableInertia $page) => $page->where('kpis.0.raw', 100000)->where('kpis.0.previous', 0)->where('kpis.0.change', null)->has('sales', 7)));
});

it('hides recent orders and to-dos the user may not see', function () {
    actingAsUserWith(['commerce.dashboard.view']);

    $this->get('/cms/commerce')->assertInertia(fn (AssertableInertia $page) => $page
        ->loadDeferredProps('lists', fn (AssertableInertia $page) => $page->where('recentOrders', [])->where('todo', [])));
});

it('gives Sunrice\'s dashboard a Store card for store staff only', function () {
    paidOrder((int) $this->mug->product_id, 120000, '2026-03-10 08:00:00');
    app(StatsRecorder::class)->recompute('2026-03-10');
    $manager = actingAsUserWith(['commerce.dashboard.view', 'commerce.orders.view']);
    $editor = actingAsUserWith(['sunrice.access-admin'], 'editor@example.com');

    expect(StoreCard::visible($manager))->toBeTrue()
        ->and(StoreCard::visible($editor))->toBeFalse()
        ->and(StoreCard::props($manager))->toMatchArray(['sales' => 'Rp120.000', 'orders' => 1])
        ->and(collect(StoreCard::props($manager)['todo'])->firstWhere('key', 'to_ship')['count'])->toBe(1);
});
