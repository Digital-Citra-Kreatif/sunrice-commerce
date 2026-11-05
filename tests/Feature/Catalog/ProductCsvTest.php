<?php

declare(strict_types=1);

use Illuminate\Http\UploadedFile;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductProjector;

beforeEach(function () {
    $this->mug = checkoutStore(['price' => 50000, 'cost' => 20000]);
    $this->collection = productCollection()->handle;
});

function csvUpload(string $csv): UploadedFile
{
    return UploadedFile::fake()->createWithContent('products.csv', $csv);
}

it('exports every variant for users who may see the products', function () {
    actingAsUserWith(['commerce.orders.view']);
    $this->get('/admin/commerce/products/export')->assertForbidden();

    actingAsUserWith(["cms.entries.{$this->collection}.view"], 'viewer@example.com');
    $csv = $this->get('/admin/commerce/products/export')->assertOk()->streamedContent();

    expect($csv)->toContain('sku,product,variant,price,compare_at_price,cost,stock,weight,active')
        ->toContain('MUG,Mug,,50000,,20000,5,500,yes');
});

it('previews the changes a CSV makes, then applies them', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update", 'commerce.inventory.adjust']);
    $page = $this->post('/admin/commerce/products/import', ['file' => csvUpload("\u{FEFF}sku,price,compare_at_price,cost,stock,active\nMUG,45000,60000,0,12,yes\nNOPE,1,,,,\nMUG2,abc,,,,\n")])
        ->assertOk()->assertInertia(fn ($p) => $p->component('Commerce/Products/Import')
        ->where('preview.0.changes', ['price' => ['from' => 50000, 'to' => 45000], 'compare_at_price' => ['from' => null, 'to' => 60000], 'cost' => ['from' => 20000, 'to' => null], 'stock' => ['from' => 5, 'to' => 12]])
        ->where('preview.1.error', 'No product has this SKU.')
        ->where('preview.2.error', 'No product has this SKU.'));
    expect($this->mug->fresh()->price)->toBe(50000);

    $this->post('/admin/commerce/products/import/apply', ['token' => $page->viewData('page')['props']['token']])
        ->assertRedirect('/admin/commerce/products')->assertSessionHas('success', '1 variant updated.');
    expect($this->mug->fresh())->price->toBe(45000)->compare_at_price->toBe(60000)->cost->toBeNull()->stock_quantity->toBe(12);
    // The product value changed too (the editor and the next publish keep it), and the stock movement says why.
    expect(ProductProjector::liveValue($this->mug->product->entry()->first())['variants'][0])->toMatchArray(['price' => 45000, 'compare_at_price' => 60000, 'cost' => null])
        ->and(StockMovement::query()->latest('id')->first())->reason->toBe('import');

    $this->post('/admin/commerce/products/import/apply', ['token' => $page->viewData('page')['props']['token']])->assertSessionHasErrors('file');
});

it('refuses bad values and stock changes without the permission', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update"]);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price,stock,active\nMUG,12.5,3,maybe\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'price: "12.5" isn\'t an amount (digits, no separators).'));
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,stock\nMUG,3\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'You may not adjust stock.'));
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,compare_at_price\nMUG,40000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'The compare-at price must be above the price.'));
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("price\n1\n")])->assertSessionHasErrors(['file' => 'The file needs a "sku" column.']);

    actingAsUserWith(["cms.entries.{$this->collection}.view"], 'viewer@example.com');
    $this->get('/admin/commerce/products/import')->assertForbidden();
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,1\n")])->assertForbidden();
    expect(Variant::query()->sole()->price)->toBe(50000);
});

it('keeps a preview to the user who made it', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update"]);
    $token = $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,40000\n")])->viewData('page')['props']['token'];

    actingAsUserWith(["cms.entries.{$this->collection}.update"], 'other@example.com');
    $this->post('/admin/commerce/products/import/apply', ['token' => $token])->assertSessionHasErrors('file');
    expect($this->mug->fresh()->price)->toBe(50000);
});

it('reads back what it exports, and refuses a SKU twice or a price at or above the compare-at price', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update", 'commerce.inventory.adjust']);
    // Negative stock is exported as '-2 (so spreadsheets don't read a formula): the import reads -2.
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,stock\nMUG,'-2\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.changes.stock', ['from' => 5, 'to' => -2])->where('preview.0.error', null));
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,40000\nMUG,30000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', null)->where('preview.1.error', 'This SKU is on line 2 too.'));

    $this->mug->update(['compare_at_price' => 60000]);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,60000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'The compare-at price must be above the price.'));
});
