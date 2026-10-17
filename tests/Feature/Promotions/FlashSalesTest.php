<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Promotions\FlashSales\Events\FlashSaleEnded;
use Sunrice\Commerce\Promotions\FlashSales\Events\FlashSaleStarted;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleBoundaries;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleItem;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleReservations;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    $this->entry = publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000]]], title: 'Mug');
    $this->product = Product::query()->where('entry_id', $this->entry->id)->firstOrFail();
});

function saleWithMug(Product $product, array $attributes = [], array $item = []): FlashSale
{
    $sale = FlashSale::query()->create([...['name' => 'Payday', 'slug' => 'payday', 'starts_at' => now()->subHour(), 'ends_at' => now()->addHour()], ...$attributes]);
    $sale->items()->create([...['product_id' => $product->id, 'discount_type' => 'percent_off', 'discount_value' => 2000], ...$item]);

    return $sale;
}

it('fires started and ended once each from the tick, and re-indexes prices', function () {
    Event::fake([FlashSaleStarted::class, FlashSaleEnded::class]);
    saleWithMug($this->product, ['starts_at' => now()->addMinutes(2), 'ends_at' => now()->addMinutes(5)]);

    $this->artisan('commerce:tick');
    $this->travel(3)->minutes();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');
    Event::assertDispatchedTimes(FlashSaleStarted::class, 1);
    expect($this->product->fresh()->min_price)->toBe(40000)->and($this->product->fresh()->on_sale)->toBeTrue();

    $this->travel(3)->minutes();
    $this->artisan('commerce:tick');
    $this->artisan('commerce:tick');
    Event::assertDispatchedTimes(FlashSaleEnded::class, 1);
    expect($this->product->fresh()->min_price)->toBe(50000);
});

it('reserves units atomically under the cap', function () {
    $item = saleWithMug($this->product, [], ['quantity_limit' => 5])->items->first();
    $reservations = app(FlashSaleReservations::class);

    expect($reservations->reserve($item->id, 3))->toBeTrue()
        ->and($reservations->reserve($item->id, 3))->toBeFalse()
        ->and($reservations->reserve($item->id, 2))->toBeTrue()
        ->and($item->fresh()->sold_quantity)->toBe(5);
    $reservations->release($item->id, 4);
    expect($item->fresh()->sold_quantity)->toBe(1);
});

it('shows the sale on the product page and its own page', function () {
    saleWithMug($this->product, ['badge' => '12.12'], ['quantity_limit' => 10, 'sold_quantity' => 4]);
    FlashSaleBoundaries::refresh([FlashSale::query()->value('id')]);

    $this->get('/products/mug')->assertOk()->assertSee('Rp40.000')->assertSee('Rp50.000')->assertSee('12.12')->assertSee('data-commerce-countdown', false)->assertSee('Terjual 4 dari 10');
    $this->get('/flash-sale/payday')->assertOk()->assertSee('Mug')->assertSee('Rp40.000');
    $this->get('/flash-sale')->assertOk()->assertSee('Payday');
});

it('manages sales in the admin and refuses overlaps', function () {
    actingAsSuperAdmin();
    $variant = Variant::query()->where('sku', 'MUG')->firstOrFail();
    $values = fn (string $name) => ['name' => $name, 'active' => true, 'dates' => ['start' => now()->addDay()->toIso8601String(), 'end' => now()->addDays(2)->toIso8601String()],
        'items' => [['target' => [['type' => 'variant', 'id' => $variant->id, 'label' => 'Mug']], 'discount_type' => 'percent_off', 'percent' => 15, 'quantity_limit' => 20]]];

    $this->post('/cms/commerce/flash-sales', ['values' => $values('Harbolnas')])->assertSessionHasNoErrors()->assertRedirect();
    $item = FlashSaleItem::query()->firstOrFail();
    expect($item->variant_id)->toBe($variant->id)->and($item->discount_value)->toBe(1500)->and($item->quantity_limit)->toBe(20);

    $this->post('/cms/commerce/flash-sales', ['values' => $values('Clash')])->assertSessionHasErrors(['values.items']);
    $this->get('/cms/commerce/flash-sales')->assertOk()->assertSee('Harbolnas');
    $sale = FlashSale::query()->firstOrFail();
    $this->get("/cms/commerce/flash-sales/{$sale->id}/edit")->assertOk();
    $this->put("/cms/commerce/flash-sales/{$sale->id}", ['values' => $values('Harbolnas 2')])->assertSessionHasNoErrors();
    expect(FlashSaleItem::query()->count())->toBe(1);
    $this->delete("/cms/commerce/flash-sales/{$sale->id}")->assertRedirect();
});
