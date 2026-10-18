<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Validator;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductData;
use Sunrice\Commerce\Catalog\ProductField;
use Sunrice\Commerce\Catalog\ProductValue;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Fields\HydrationContext;

function productErrors(array $value): array
{
    return ProductValue::errors(ProductValue::normalize($value));
}

function variableValue(array $overrides = []): array
{
    return array_replace([
        'type' => 'variable',
        'options' => [
            ['id' => 'size', 'name' => 'Size', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]],
        ],
        'variants' => [
            ['id' => 'v1', 'options' => ['size' => 's'], 'sku' => 'TS-S', 'price' => 150000],
            ['id' => 'v2', 'options' => ['size' => 'm'], 'sku' => 'TS-M', 'price' => 160000],
        ],
    ], $overrides);
}

it('accepts valid simple, variable and bundle values', function () {
    expect(productErrors(['type' => 'simple', 'variants' => [['price' => 50000, 'sku' => 'A1']]]))->toBe([])
        ->and(productErrors(variableValue()))->toBe([]);

    $component = Variant::factory()->create();
    expect(productErrors(['type' => 'bundle', 'variants' => [['price' => 90000]],
        'bundle' => ['pricing' => 'percent_off', 'value' => 1000, 'items' => [['variant_id' => $component->id, 'quantity' => 2]]]]))->toBe([]);
});

it('refuses invalid values', function (array $value, string $path) {
    expect(productErrors($value))->toHaveKey($path);
})->with([
    'negative price' => [['variants' => [['price' => -1]]], 'variants.0.price'],
    'missing option value' => [variableValue(['variants' => [['id' => 'v1', 'options' => [], 'price' => 1]]]), 'variants.0.options'],
    'duplicate combination' => [variableValue(['variants' => [['id' => 'v1', 'options' => ['size' => 's'], 'price' => 1], ['id' => 'v2', 'options' => ['size' => 's'], 'price' => 1]]]), 'variants.1.options'],
    'duplicate sku in value' => [variableValue(['variants' => [['id' => 'v1', 'options' => ['size' => 's'], 'sku' => 'X', 'price' => 1], ['id' => 'v2', 'options' => ['size' => 'm'], 'sku' => 'x', 'price' => 1]]]), 'variants.1.sku'],
    'too many options' => [variableValue(['options' => array_map(fn ($i) => ['id' => "o{$i}", 'name' => "O{$i}", 'values' => [['id' => "v{$i}", 'label' => 'A']]], range(1, 4))]), 'options'],
    'external without links' => [['purchase_mode' => 'external'], 'external_links'],
    'bad link' => [['external_links' => [['preset' => 'shopee', 'url' => 'javascript:alert(1)']]], 'external_links.0.url'],
    'max below min' => [['variants' => [['price' => 1, 'min_qty' => 5, 'max_qty' => 2]]], 'variants.0.max_qty'],
    'tier below 2' => [['tiers' => [['min_qty' => 1, 'type' => 'percent_off', 'value' => 500]]], 'tiers.0.min_qty'],
    'percent tier over 100%' => [['tiers' => [['min_qty' => 5, 'type' => 'percent_off', 'value' => 20000]]], 'tiers.0.value'],
    'empty bundle' => [['type' => 'bundle', 'bundle' => ['items' => []]], 'bundle.items'],
    'url download without url' => [['downloads' => [['type' => 'url', 'name' => 'Guide']]], 'downloads.0'],
]);

it('refuses SKUs of other products, but not its own variants', function () {
    Variant::factory()->create(['sku' => 'TAKEN', 'uid' => 'other']);

    expect(productErrors(['variants' => [['id' => 'mine', 'sku' => 'taken', 'price' => 1]]]))->toHaveKey('variants.0.sku')
        ->and(productErrors(['variants' => [['id' => 'other', 'sku' => 'TAKEN', 'price' => 1]]]))->toBe([]);
});

it('refuses nested bundles and switched-off types', function () {
    $bundle = Variant::factory()->create();
    $bundle->product->update(['type' => 'bundle']);
    expect(productErrors(['type' => 'bundle', 'bundle' => ['items' => [['variant_id' => $bundle->id]]]]))->toHaveKey('bundle.items.0');

    app(ToggleFeature::class)->handle('variants', false);
    expect(productErrors(variableValue()))->toHaveKey('type');
});

it('normalizes: defaults, stable ids, unknown keys, the simple invariant', function () {
    $field = new ProductField;
    $value = $field->normalize([
        'type' => 'simple',
        'hack' => 'x',
        'options' => [['id' => 'size', 'name' => 'Size', 'values' => [['label' => 'S']]]],
        'variants' => [['id' => 'keep', 'price' => '150000', 'options' => ['size' => 's'], 'evil' => 1], ['price' => 1]],
    ], []);

    expect($value)->not->toHaveKey('hack')
        ->and($value['options'])->toBe([])
        ->and($value['variants'])->toHaveCount(1)
        ->and($value['variants'][0]['id'])->toBe('keep')
        ->and($value['variants'][0]['price'])->toBe(150000)
        ->and($value['variants'][0])->not->toHaveKey('evil');

    $variable = $field->normalize(variableValue(['options' => [['name' => 'Size', 'values' => [['label' => 'S']]]]]), []);
    expect($variable['options'][0]['id'])->toHaveLength(26)
        ->and($variable['options'][0]['values'][0]['id'])->toHaveLength(26);
});

it('validates through Laravel rules and hydrates to ProductData', function () {
    $field = new ProductField;
    $validator = Validator::make(['product' => ['variants' => [['price' => -5]]]], ['product' => $field->rules([])]);
    expect($validator->fails())->toBeTrue();

    $data = $field->hydrate(variableValue(), [], new HydrationContext('id'));
    expect($data)->toBeInstanceOf(ProductData::class)
        ->and($data->priceRange())->toBe([150000, 160000])
        ->and($data->valueLabel('size', 'm'))->toBe('M')
        ->and($data['type'])->toBe('variable');
});
