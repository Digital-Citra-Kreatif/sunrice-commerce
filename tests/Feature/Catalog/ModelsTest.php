<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;

it('builds a variable product with options and variants', function () {
    $product = Product::factory()->variable(['Size' => ['S', 'M', 'L'], 'Color' => ['Red', 'Blue']])->create();

    expect($product->options)->toHaveCount(2)
        ->and($product->options->first()->values->pluck('label')->all())->toBe(['S', 'M', 'L'])
        ->and($product->variants)->toHaveCount(6)
        ->and($product->variants->first()->title)->toBe('S / Red')
        ->and($product->variants->first()->optionValues->pluck('label')->sort()->values()->all())->toBe(['Red', 'S']);
});

it('keeps soft-deleted variants for references and computes stock status', function () {
    $product = Product::factory()->simple(50000)->create();
    $variant = $product->variants->first();
    $variant->delete();

    expect($product->variants()->count())->toBe(0)
        ->and(Variant::withTrashed()->find($variant->id))->not->toBeNull()
        ->and($variant->requiresShipping())->toBeTrue();

    $tracked = Variant::factory()->tracked(0, 'allow')->create();
    expect($tracked->computedStockStatus())->toBe('backorder');
    StockMovement::query()->create(['variant_id' => $tracked->id, 'delta' => 5, 'quantity_after' => 5, 'reason' => 'manual']);
    expect($tracked->movements()->first()->delta)->toBe(5);
});
