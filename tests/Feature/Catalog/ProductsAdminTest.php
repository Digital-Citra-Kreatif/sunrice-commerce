<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Models\Entry;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    actingAsSuperAdmin();
    $this->mug = publishProduct(['variants' => [['id' => 'm', 'sku' => 'MUG-1', 'price' => 50000]]], title: 'Mug');
    $this->shirt = publishProduct(['type' => 'variable', 'options' => [['id' => 'o', 'name' => 'Size', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'l', 'label' => 'L']]]],
        'variants' => [['id' => 'vs', 'options' => ['o' => 's'], 'sku' => 'TS-S', 'price' => 90000], ['id' => 'vl', 'options' => ['o' => 'l'], 'sku' => 'TS-L', 'price' => 95000]]], title: 'Shirt');
    $this->draft = publishProduct(['variants' => [['id' => 'd', 'price' => 1]]], title: 'Draft hat', publish: false);
});

function productRows($test, string $query = ''): array
{
    $rows = [];
    $test->get('/cms/commerce/products'.$query)->assertOk()->assertInertia(function (AssertableInertia $page) use (&$rows) {
        $rows = $page->toArray()['props']['rows']['data'];
    });

    return collect($rows)->keyBy('product_title')->all();
}

it('lists product entries with their commerce data', function () {
    $rows = productRows($this);

    expect(array_keys($rows))->toEqualCanonicalizing(['Mug', 'Shirt', 'Draft hat'])
        ->and($rows['Shirt']['min_price'])->toBe('Rp90.000 – Rp95.000')
        ->and($rows['Shirt']['sku'])->toBe('2 variants')
        ->and($rows['Mug']['sku'])->toBe('MUG-1')
        ->and($rows['Draft hat']['state'])->toBe('draft')
        ->and($rows['Mug']['href'])->toBe("collections/products/entries/{$this->mug->id}/edit");
});

it('filters and searches by SKU', function () {
    expect(array_keys(productRows($this, '?filters[type]=variable')))->toBe(['Shirt'])
        ->and(array_keys(productRows($this, '?filters[state]=draft')))->toBe(['Draft hat'])
        ->and(array_keys(productRows($this, '?search=TS-L')))->toBe(['Shirt'])
        ->and(array_keys(productRows($this, '?search=mug')))->toBe(['Mug']);
});

it('marks a sync failure', function () {
    Product::query()->where('entry_id', $this->mug->id)->update(['sync_status' => 'failed', 'sync_error' => 'boom']);

    expect(productRows($this)['Mug']['sync_failed'])->toBeTrue()
        ->and(array_keys(productRows($this, '?filters[sync]=failed')))->toBe(['Mug']);
});

it('marks products featured and sets stock status in bulk, through their values', function () {
    $this->post('/cms/commerce/products/bulk', ['action' => 'featured', 'ids' => [$this->mug->id, $this->shirt->id]])->assertSessionHas('success', '2 products updated.');
    $this->post('/cms/commerce/products/bulk', ['action' => 'out_of_stock', 'ids' => [$this->mug->id]]);

    $mug = Product::query()->where('entry_id', $this->mug->id)->firstOrFail();
    expect($mug->featured)->toBeTrue()->and($mug->in_stock)->toBeFalse()
        ->and(Variant::query()->where('sku', 'MUG-1')->value('stock_status'))->toBe('out_of_stock')
        ->and(Entry::query()->find($this->mug->id)->mainTranslation()->data['product']['featured'])->toBeTrue();
});

it('needs entry permissions for bulk changes', function () {
    actingAsUserWith(['commerce.dashboard.view']);

    $this->get('/cms/commerce/products')->assertForbidden();
    $this->post('/cms/commerce/products/bulk', ['action' => 'featured', 'ids' => [$this->mug->id]])->assertSessionHas('success', '0 products updated.');
    expect(Product::query()->where('entry_id', $this->mug->id)->value('featured'))->toBeFalsy();
});
