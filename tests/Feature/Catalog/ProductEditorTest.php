<?php

declare(strict_types=1);

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Models\Entry;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    actingAsSuperAdmin();
});

it('creates, drafts and publishes a variable product through the entry editor', function () {
    $value = [
        'type' => 'variable',
        'options' => [['id' => 'opt1', 'name' => 'Size', 'values' => [['id' => 'val1', 'label' => 'S'], ['id' => 'val2', 'label' => 'M']]]],
        'variants' => [
            ['id' => 'var1', 'options' => ['opt1' => 'val1'], 'sku' => 'KAOS-S', 'price' => 99000, 'track_stock' => true, 'initial_stock' => 5],
            ['id' => 'var2', 'options' => ['opt1' => 'val2'], 'sku' => 'KAOS-M', 'price' => 109000],
        ],
    ];
    $this->post('/cms/collections/products/entries', ['title' => 'Kaos', 'slug' => 'kaos', 'data' => ['product' => $value]])
        ->assertSessionHasNoErrors()->assertRedirect();
    $entry = Entry::query()->latest('id')->firstOrFail();
    expect(Product::query()->where('entry_id', $entry->id)->exists())->toBeFalse(); // drafts aren't projected

    $this->post("/cms/entries/{$entry->id}/publish", ['locale' => 'id'])->assertSessionHasNoErrors();

    $product = Product::query()->where('entry_id', $entry->id)->firstOrFail();
    expect($product->variants->pluck('sku')->all())->toBe(['KAOS-S', 'KAOS-M'])
        ->and($product->variants->first()->stock_quantity)->toBe(5);

    $this->getJson("/cms/commerce/api/products/{$entry->id}")->assertOk()
        ->assertJsonPath('data.sync_status', 'ok')
        ->assertJsonPath('data.variants.var1.stock_quantity', 5);
});

it('refuses an invalid product value with a readable message', function () {
    $this->post('/cms/collections/products/entries', ['title' => 'Bad', 'slug' => 'bad']);
    $entry = Entry::query()->latest('id')->firstOrFail();

    $this->put("/cms/entries/{$entry->id}", ['locale' => 'id', 'title' => 'Bad', 'slug' => 'bad', 'data' => ['product' => ['variants' => [['price' => -1]]]]])
        ->assertSessionHasErrors(['data.product' => 'Enter 0 or more.']);
});

it('checks SKUs and searches variants for bundles', function () {
    $taken = publishProduct(['variants' => [['id' => 'a', 'sku' => 'MUG-01', 'price' => 50000]]], title: 'Mug');

    $this->getJson('/cms/commerce/api/sku-check?sku=mug-01&entry=0')->assertJson(['available' => false, 'product' => 'Mug']);
    $this->getJson("/cms/commerce/api/sku-check?sku=MUG-01&entry={$taken->id}")->assertJson(['available' => true]);
    $this->getJson('/cms/commerce/api/variants?q=mug')->assertJsonPath('data.0.sku', 'MUG-01')->assertJsonPath('data.0.label', 'Mug');
});

it('keeps the product and target lookups to users who manage them', function () {
    publishProduct(['variants' => [['id' => 'a', 'sku' => 'MUG-01', 'price' => 50000]]], title: 'Mug');
    actingAsUserWith([], 'editor@example.com');
    $this->getJson('/cms/commerce/api/sku-check?sku=mug-01&entry=0')->assertForbidden();
    $this->getJson('/cms/commerce/api/variants?q=mug')->assertForbidden();
    $this->getJson('/cms/commerce/api/targets?q=mug')->assertForbidden();

    $collection = productCollection();
    actingAsUserWith(["sunrice.entries.{$collection->id}.edit"], 'catalog@example.com');
    $this->getJson('/cms/commerce/api/sku-check?sku=mug-01&entry=0')->assertOk();
    $this->getJson('/cms/commerce/api/variants?q=mug')->assertOk();

    actingAsUserWith(['commerce.vouchers.manage'], 'promo@example.com');
    $this->getJson('/cms/commerce/api/targets?q=mug')->assertOk()->assertJsonFragment(['label' => 'Mug']);
});

it('uploads digital files privately and attaches them on publish', function () {
    Storage::fake('local');
    $id = $this->post('/cms/commerce/api/downloads', ['file' => UploadedFile::fake()->create('ebook.pdf', 100, 'application/pdf')])
        ->assertCreated()->json('data.id');
    $file = DownloadFile::query()->findOrFail($id);
    expect($file->attached)->toBeFalse();
    Storage::disk('local')->assertExists($file->path);

    $entry = publishProduct(['downloadable' => true, 'requires_shipping' => false, 'variants' => [['id' => 'e', 'price' => 30000]],
        'downloads' => [['id' => 'd1', 'type' => 'file', 'file_id' => $id, 'name' => 'E-book']]]);
    expect($file->fresh()->attached)->toBeTrue()
        ->and($file->fresh()->product_id)->toBe(Product::query()->where('entry_id', $entry->id)->value('id'));

    publishProduct(['downloadable' => true, 'requires_shipping' => false, 'variants' => [['id' => 'e', 'price' => 30000]], 'downloads' => []], $entry);
    expect($file->fresh()->attached)->toBeFalse()->and($file->fresh()->trashed())->toBeFalse();

    // Unattached uploads without a product are pruned after 7 days.
    $orphan = DownloadFile::query()->create(['type' => 'file', 'name' => 'x', 'disk' => 'local', 'path' => 'x.pdf', 'attached' => false]);
    $this->travel(8)->days();
    $this->artisan('commerce:prune')->assertSuccessful();
    expect(DownloadFile::withTrashed()->find($orphan->id))->toBeNull()
        ->and($file->fresh())->not->toBeNull();
});
