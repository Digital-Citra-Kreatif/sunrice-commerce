<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Sunrice\Actions\Entries\ForceDeleteEntry;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Commerce\Catalog\Events\ProductSynced;
use Sunrice\Commerce\Catalog\Events\ProductSyncFailed;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductProjector;

function shirt(?array $variants = null): array
{
    return [
        'type' => 'variable',
        'options' => [['id' => 'size', 'name' => 'Size', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M'], ['id' => 'l', 'label' => 'L']]]],
        'variants' => $variants ?? [
            ['id' => 'v-s', 'options' => ['size' => 's'], 'sku' => 'TS-S', 'price' => 150000, 'track_stock' => true, 'initial_stock' => 10],
            ['id' => 'v-m', 'options' => ['size' => 'm'], 'sku' => 'TS-M', 'price' => 160000, 'compare_at_price' => 200000],
        ],
        'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'value' => 500]],
    ];
}

it('creates rows on publish and updates them in place', function () {
    $entry = publishProduct(shirt());
    $product = Product::query()->where('entry_id', $entry->id)->firstOrFail();
    $small = $product->variants()->where('uid', 'v-s')->firstOrFail();

    expect($product->type)->toBe('variable')
        ->and($product->min_price)->toBe(150000)->and($product->max_price)->toBe(160000)
        ->and($product->on_sale)->toBeTrue()->and($product->in_stock)->toBeTrue()
        ->and($product->variants)->toHaveCount(2)
        ->and($small->title)->toBe('S')->and($small->stock_quantity)->toBe(10)
        ->and($product->tiers)->toHaveCount(1);

    $value = shirt();
    $value['variants'][0]['price'] = 140000;
    $value['variants'][0]['initial_stock'] = 99;
    publishProduct($value, $entry);

    $small->refresh();
    expect($small->price)->toBe(140000)
        ->and($small->stock_quantity)->toBe(10) // initial_stock applies once
        ->and(StockMovement::query()->where('variant_id', $small->id)->count())->toBe(1)
        ->and($product->fresh()->min_price)->toBe(140000);
});

it('soft-deletes removed variants and restores them when they come back', function () {
    $entry = publishProduct(shirt());
    $medium = Variant::query()->where('uid', 'v-m')->firstOrFail();

    publishProduct(shirt([shirt()['variants'][0]]), $entry);
    expect(Variant::query()->whereKey($medium->id)->exists())->toBeFalse()
        ->and(Variant::withTrashed()->find($medium->id)->trashed())->toBeTrue();

    publishProduct(shirt(), $entry);
    expect(Variant::query()->find($medium->id))->not->toBeNull();
});

it('skips an unchanged value and ignores drafts', function () {
    Event::fake([ProductSynced::class]);
    $entry = publishProduct(shirt());
    publishProduct(shirt(), $entry);
    Event::assertDispatchedTimes(ProductSynced::class, 1);

    $value = shirt();
    $value['variants'][0]['price'] = 1;
    publishProduct($value, $entry, publish: false);
    expect(Variant::query()->where('uid', 'v-s')->value('price'))->toBe(150000);
});

it('records a failure without breaking the publish', function () {
    Event::fake([ProductSyncFailed::class]);
    $entry = publishProduct(shirt(), publish: false);
    Variant::factory()->create(['sku' => 'TS-S']); // taken between saving and publishing
    app(PublishTranslation::class)->handle($entry->mainTranslation());
    $entry->refresh();

    expect($entry->status)->toBe('published');
    $product = Product::query()->where('entry_id', $entry->id)->firstOrFail();
    expect($product->sync_status)->toBe('failed')
        ->and($product->sync_error)->toContain('TS-S')
        ->and($product->variants)->toHaveCount(0);
    Event::assertDispatched(ProductSyncFailed::class);
});

it('marks the product removed when the entry is deleted for good', function () {
    $entry = publishProduct(shirt());
    app(ForceDeleteEntry::class)->handle($entry);

    $product = Product::query()->where('entry_id', $entry->id)->firstOrFail();
    expect($product->removed_at)->not->toBeNull()
        ->and(Variant::withTrashed()->where('product_id', $product->id)->count())->toBe(2)
        ->and($product->variants()->count())->toBe(0);
});

it('syncs every product from the console', function () {
    $entry = publishProduct(shirt());
    Variant::withTrashed()->forceDelete();
    Product::query()->delete();

    $this->artisan('commerce:sync-products')->expectsOutputToContain('Synced 1 products.')->assertSuccessful();
    expect(Product::query()->where('entry_id', $entry->id)->exists())->toBeTrue();
});

it('maps a value in memory without writing', function () {
    $entry = publishProduct(shirt());
    $product = Product::query()->where('entry_id', $entry->id)->firstOrFail();
    $value = shirt();
    $value['variants'][1]['price'] = 99000;

    $mapped = app(ProductProjector::class)->map($value, $product);
    expect($mapped->min_price)->toBe(99000)
        ->and($mapped->variants->first()->stock_quantity)->toBe(10)
        ->and($mapped->variants->last()->title)->toBe('M')
        ->and($product->fresh()->min_price)->toBe(150000);
});
