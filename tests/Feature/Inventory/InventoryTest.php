<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Spatie\Permission\PermissionRegistrar;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Inventory\DatabaseInventory;
use Sunrice\Commerce\Inventory\Events\StockBackIn;
use Sunrice\Commerce\Inventory\Events\StockLow;
use Sunrice\Commerce\Inventory\Events\StockOut;
use Sunrice\Commerce\Inventory\OutOfStock;
use Sunrice\Commerce\Support\Nulls\NullInventory;

it('binds the database inventory while the module is on', function () {
    expect(app(Inventory::class))->toBeInstanceOf(DatabaseInventory::class);
    app(ToggleFeature::class)->handle('inventory', false);
    app()->forgetScopedInstances();
    expect(app(Inventory::class))->toBeInstanceOf(NullInventory::class);
});

it('reserves all or nothing and refuses beyond stock', function () {
    $a = Variant::factory()->tracked(5)->create();
    $b = Variant::factory()->tracked(1)->create();

    expect(fn () => app(Inventory::class)->reserve([[$a, 2], [$b, 2]]))->toThrow(OutOfStock::class);
    expect($a->fresh()->stock_quantity)->toBe(5)->and($b->fresh()->stock_quantity)->toBe(1);

    app(Inventory::class)->reserve([[$a, 2], [$b, 1]]);
    expect($a->fresh()->stock_quantity)->toBe(3)
        ->and($b->fresh()->stock_quantity)->toBe(0)
        ->and($b->fresh()->stock_status)->toBe('out_of_stock')
        ->and(StockMovement::query()->where('variant_id', $a->id)->value('delta'))->toBe(-2);
});

it('sells into backorder when allowed', function () {
    $variant = Variant::factory()->tracked(1, 'allow')->create();

    app(Inventory::class)->reserve([[$variant, 3]]);
    expect($variant->fresh()->stock_quantity)->toBe(-2)->and($variant->fresh()->stock_status)->toBe('backorder');
});

it('releases stock and fires threshold events once per crossing', function () {
    Event::fake([StockLow::class, StockOut::class, StockBackIn::class]);
    $variant = Variant::factory()->tracked(7)->create(['low_stock_threshold' => 5]);
    $inventory = app(Inventory::class);

    $inventory->reserve([[$variant, 2]]); // 5: low
    $inventory->reserve([[$variant, 1]]); // 4: still low, no new event
    $inventory->reserve([[$variant, 4]]); // 0: out
    $inventory->release([[$variant, 4]]); // 4: back in

    Event::assertDispatchedTimes(StockLow::class, 1);
    Event::assertDispatchedTimes(StockOut::class, 1);
    Event::assertDispatchedTimes(StockBackIn::class, 1);
    expect($variant->fresh()->stock_quantity)->toBe(4);
});

it('keeps the listing in_stock flag current', function () {
    $product = Product::factory()->has(Variant::factory()->tracked(1), 'variants')->create(['in_stock' => true]);
    app(Inventory::class)->reserve([[$product->variants->first(), 1]]);

    expect($product->fresh()->in_stock)->toBeFalse();
});

it('adjusts stock from the inventory page with permissions and history', function () {
    $variant = Variant::factory()->tracked(3)->create();
    $user = actingAsUserWith(['commerce.inventory.view']);

    $this->get('/cms/commerce/inventory')->assertOk();
    $this->post("/cms/commerce/inventory/{$variant->id}/adjust", ['mode' => 'add', 'quantity' => 5, 'reason' => 'manual'])->assertForbidden();

    $user->roles->first()->givePermissionTo('commerce.inventory.adjust');
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $this->post("/cms/commerce/inventory/{$variant->id}/adjust", ['mode' => 'add', 'quantity' => 5, 'reason' => 'manual', 'note' => 'Restock'])->assertSessionHasNoErrors();
    $this->post("/cms/commerce/inventory/{$variant->id}/adjust", ['mode' => 'set', 'quantity' => 2, 'reason' => 'correction'])->assertSessionHasNoErrors();

    expect($variant->fresh()->stock_quantity)->toBe(2);
    $this->getJson("/cms/commerce/inventory/{$variant->id}/history")
        ->assertJsonPath('data.0.delta', -6)->assertJsonPath('data.0.reason', 'correction')
        ->assertJsonPath('data.1.note', 'Restock')->assertJsonPath('data.1.user', 'Staff');
});

it('needs the inventory permission and module', function () {
    actingAsUserWith(['commerce.dashboard.view']);
    $this->get('/cms/commerce/inventory')->assertForbidden();

    actingAsSuperAdmin();
    app(ToggleFeature::class)->handle('inventory', false);
    $this->get('/cms/commerce/inventory')->assertNotFound();
});
