<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Models\Entry;

beforeEach(function () {
    $this->mugEntry = publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 40000, 'weight' => 300, 'track_stock' => true, 'initial_stock' => 10]]], title: 'Mug');
    $this->teaEntry = publishProduct(['variants' => [['id' => 'tea', 'sku' => 'TEA', 'price' => 25000, 'weight' => 100, 'track_stock' => true, 'initial_stock' => 3]]], title: 'Tea');
    $this->mug = Variant::query()->where('sku', 'MUG')->firstOrFail();
    $this->tea = Variant::query()->where('sku', 'TEA')->firstOrFail();
});

function giftSet(string $pricing, int $value, int $price = 70000): Product
{
    $entry = publishProduct(['type' => 'bundle', 'variants' => [['id' => 'gift', 'sku' => 'GIFT', 'price' => $price]],
        'bundle' => ['pricing' => $pricing, 'value' => $value, 'items' => [['variant_id' => test()->mug->id, 'quantity' => 1], ['variant_id' => test()->tea->id, 'quantity' => 2]]]], title: 'Gift set');

    return Product::query()->where('entry_id', $entry->id)->firstOrFail();
}

it('prices bundles by each mode', function (string $pricing, int $value, int $expected) {
    $bundle = giftSet($pricing, $value);

    expect(app(Bundles::class)->price($bundle, $bundle->variants->first()))->toBe($expected)
        ->and($bundle->fresh()->min_price)->toBe($expected);
})->with([
    'fixed' => ['fixed', 0, 70000],
    'percent off the sum' => ['percent_off', 1000, 81000],   // (40000 + 2×25000) − 10%
    'amount off the sum' => ['amount_off', 15000, 75000],
]);

it('follows its components\' stock and weight', function () {
    $bundle = giftSet('fixed', 0);
    $variant = $bundle->variants->first();

    expect(app(Bundles::class)->available($bundle))->toBe(1) // 3 tea ÷ 2
        ->and(app(Bundles::class)->weight($bundle, $variant))->toBe(500)
        ->and(app(Catalog::class)->check($variant, 1)->isOk())->toBeTrue()
        ->and(app(Catalog::class)->check($variant, 2)->reason)->toBe('out_of_stock');

    app(Inventory::class)->reserve([[$variant->fresh(), 1]]);
    expect($this->tea->fresh()->stock_quantity)->toBe(1)
        ->and($this->mug->fresh()->stock_quantity)->toBe(9)
        ->and($bundle->fresh()->in_stock)->toBeFalse();
});

it('is unavailable when a component is unpublished', function () {
    $bundle = giftSet('fixed', 0);
    Entry::query()->whereKey($this->teaEntry->id)->update(['status' => 'draft']);
    app()->forgetScopedInstances();

    expect(app(Bundles::class)->available($bundle->fresh()))->toBe(0)
        ->and(app(Catalog::class)->check($bundle->variants->first()->fresh(), 1)->reason)->toBe('out_of_stock');
});

it('explodes into component lines', function () {
    $bundle = giftSet('fixed', 0);
    $lines = app(Bundles::class)->explode($bundle, 3);

    expect(array_map(fn ($l) => [$l['variant']->sku, $l['quantity']], $lines))->toBe([['MUG', 3], ['TEA', 6]]);
});
