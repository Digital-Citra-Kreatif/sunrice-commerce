<?php

declare(strict_types=1);

use Illuminate\Http\UploadedFile;
use Spatie\Permission\PermissionRegistrar;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductProjector;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Features\Actions\ToggleFeature;

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

it('skips a stale stock row after a reservation and keeps changes to other variants', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update", 'commerce.inventory.adjust']);
    $this->mug->update(['stock_quantity' => 1]);
    publishProduct(['variants' => [['id' => 'other', 'sku' => 'OTHER', 'price' => 30000]]], title: 'Other');
    $token = $this->post('/admin/commerce/products/import', [
        'file' => csvUpload("sku,price,stock\nMUG,45000,12\nOTHER,25000,\n"),
    ])->viewData('page')['props']['token'];

    app(Inventory::class)->reserve([[$this->mug, 1]]);

    $report = "/admin/commerce/products/import?report={$token}";
    $this->post('/admin/commerce/products/import/apply', ['token' => $token])->assertRedirect($report);
    $this->get($report)->assertInertia(fn ($page) => $page
        ->where('result.summary', '1 variant updated.')
        ->where('result.skipped.0.line', 2)
        ->where('result.skipped.0.sku', 'MUG')
        ->where('result.skipped.0.reason', 'The stock changed since preview. Preview the file again.'));
    expect($this->mug->fresh())->price->toBe(50000)->stock_quantity->toBe(0)
        ->and(Variant::query()->where('sku', 'OTHER')->firstOrFail()->price)->toBe(25000)
        ->and(StockMovement::query()->where('variant_id', $this->mug->id)->where('reason', 'import')->exists())->toBeFalse();

    actingAsUserWith(["cms.entries.{$this->collection}.update"], 'other@example.com');
    $this->get($report)->assertInertia(fn ($page) => $page->where('result', null));
});

it('rechecks the compare-at price when a different field changed after preview', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update"]);
    $this->mug->update(['compare_at_price' => 70000]);
    $token = $this->post('/admin/commerce/products/import', [
        'file' => csvUpload("sku,price\nMUG,65000\n"),
    ])->viewData('page')['props']['token'];

    $this->mug->update(['compare_at_price' => 60000]);

    $report = "/admin/commerce/products/import?report={$token}";
    $this->post('/admin/commerce/products/import/apply', ['token' => $token])->assertRedirect($report);
    $this->get($report)->assertInertia(fn ($page) => $page
        ->where('result.summary', '0 variants updated.')
        ->where('result.skipped.0.reason', 'The compare-at price must be above the current price. Preview the file again.'));
    expect($this->mug->fresh())->price->toBe(50000)->compare_at_price->toBe(60000);
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
    // An oversold mug exports its stock as '-2 (so spreadsheets don't read a formula): read back as -2, no change.
    $this->mug->update(['stock_quantity' => -2]);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,stock,price\nMUG,'-2,45000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.changes', ['price' => ['from' => 50000, 'to' => 45000]])->where('preview.0.error', null));
    // Stock is only ever set to 0 or more.
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,stock\nMUG,-3\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', "stock can't be set below 0."));
    $this->mug->update(['stock_quantity' => 5]);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,40000\nMUG,30000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', null)->where('preview.1.error', 'This SKU is on line 2 too.'));

    $this->mug->update(['compare_at_price' => 60000]);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,60000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'The compare-at price must be above the price.'));
});

it('refuses amounts above the price limit, and stock while the inventory module is off', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update", 'commerce.inventory.adjust']);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\nMUG,100000000000001\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'price: "100000000000001" is too high.'));

    app(ToggleFeature::class)->handle('inventory', false);
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,stock\nMUG,3\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'Stock tracking is switched off (Settings → Modules).'));
});

it('checks the stock permission again when a preview is applied', function () {
    $user = actingAsUserWith(["cms.entries.{$this->collection}.update", 'commerce.inventory.adjust']);
    $token = $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price,stock\nMUG,45000,12\n")])->viewData('page')['props']['token'];

    $user->roles->first()->revokePermissionTo('commerce.inventory.adjust');
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $report = "/admin/commerce/products/import?report={$token}";
    $this->actingAs($user->fresh(), 'web')->post('/admin/commerce/products/import/apply', ['token' => $token])->assertRedirect($report);
    $this->get($report)->assertInertia(fn ($page) => $page
        ->where('result.summary', '1 variant updated.')
        ->where('result.skipped.0.reason', 'Stock was skipped because inventory is off or you no longer have permission.'));

    expect($this->mug->fresh())->price->toBe(45000)->stock_quantity->toBe(5);
});

it('reads the SKU "0", and refuses an amount too big for an integer', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update"]);
    $this->mug->update(['sku' => '0']);
    // 2^64: cast to an int, it would come out as 0 or negative.
    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\n0,18446744073709551616\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.error', 'price: "18446744073709551616" is too high.'));
    $page = $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,price\n0,45000\n")])
        ->assertInertia(fn ($p) => $p->where('preview.0.changes.price', ['from' => 50000, 'to' => 45000])->where('preview.0.error', null));
    $this->post('/admin/commerce/products/import/apply', ['token' => $page->viewData('page')['props']['token']])->assertSessionHas('success', '1 variant updated.');
    expect($this->mug->fresh()->price)->toBe(45000);

});

it('creates products for new SKUs when asked: variants by row, drafts by default', function () {
    $category = term((string) config('commerce.catalog.category_taxonomy'), 'Gaun Pesta');
    actingAsUserWith(["cms.entries.{$this->collection}.create", "cms.entries.{$this->collection}.update", "cms.entries.{$this->collection}.publish"]);
    $csv = "sku,product,variant,option,price,stock,weight,category\n"
        ."GM-S,Gaun Merah,S,Ukuran,150000,,800,Gaun Pesta\n"
        ."GM-M,Gaun Merah,M,Ukuran,160000,,800,gaun-pesta\n"
        ."KB-1,Kebaya Biru,,,250000,3,,\n"
        ."KX-1,Kebaya X,,,,,,\n"
        ."GM-S,Gaun Merah,L,Ukuran,1,,,\n"
        ."MUG,,,,45000,,,\n";

    // Without the option, an unknown SKU is still refused.
    $this->post('/admin/commerce/products/import', ['file' => csvUpload($csv)])->assertInertia(fn ($p) => $p->where('preview.0.error', 'No product has this SKU.'));

    $page = $this->post('/admin/commerce/products/import', ['file' => csvUpload($csv), 'create' => '1'])->assertOk()
        ->assertInertia(fn ($p) => $p->where('canCreate', true)
            ->where('preview.0.create.product', 'Gaun Merah')->where('preview.0.create.price', 150000)->where('preview.0.create.category', $category->id)
            ->where('preview.0.error', null)
            ->where('preview.2.create.stock', 3)
            ->where('preview.3.error', 'A new product needs a price.')
            ->where('preview.4.error', 'This SKU is on line 2 too.')
            ->where('preview.5.changes.price', ['from' => 50000, 'to' => 45000]));

    $this->post('/admin/commerce/products/import/apply', ['token' => $page->viewData('page')['props']['token']])
        ->assertSessionHas('success', '1 variant updated. 2 products created.');

    $translation = EntryTranslation::query()->where('draft_title', 'Gaun Merah')->firstOrFail();
    $gown = $translation->entry;
    $value = $translation->draft_data['product'];
    expect($translation->status)->toBe('draft')
        ->and($translation->draft_slug)->toBe('gaun-merah')
        ->and($value['type'])->toBe('variable')
        ->and($value['options'][0]['name'])->toBe('Ukuran')
        ->and(array_column($value['options'][0]['values'], 'label'))->toBe(['S', 'M'])
        ->and(array_column($value['variants'], 'sku'))->toBe(['GM-S', 'GM-M'])
        ->and(array_map('intval', (array) ($gown->draft_terms ?? $gown->terms()->pluck('sunrice_terms.id')->all())))->toBe([$category->id])
        ->and(Variant::query()->where('sku', 'GM-S')->exists())->toBeFalse(); // a draft isn't in the store yet
    expect($this->mug->fresh()->price)->toBe(45000);
});

it('publishes the new products when asked, so their SKUs are in the store', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.create", "cms.entries.{$this->collection}.update", "cms.entries.{$this->collection}.publish", 'commerce.inventory.adjust']);
    $page = $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,product,price,stock\nKB-1,Kebaya Biru,250000,3\n"), 'create' => '1', 'publish' => '1']);

    $this->post('/admin/commerce/products/import/apply', ['token' => $page->viewData('page')['props']['token']])->assertSessionHas('success', '0 variants updated. 1 product created.');

    expect(Variant::query()->where('sku', 'KB-1')->first())->not->toBeNull()
        ->price->toBe(250000)->track_stock->toBeTrue()->stock_quantity->toBe(3);
});

it('creates nothing for users who may not create products', function () {
    actingAsUserWith(["cms.entries.{$this->collection}.update"]);

    $this->post('/admin/commerce/products/import', ['file' => csvUpload("sku,product,price\nKB-1,Kebaya Biru,250000\n"), 'create' => '1'])
        ->assertInertia(fn ($p) => $p->where('canCreate', false)->where('preview.0.error', 'You may not create products.'));
});
