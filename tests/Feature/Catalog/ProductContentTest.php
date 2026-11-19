<?php

declare(strict_types=1);

use Sunrice\Admin\Media\Media;
use Sunrice\Cms\Models\Blueprint;
use Sunrice\Cms\Models\Entry;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    actingAsSuperAdmin();
});

function saveCatalogContentProduct(string $name, array $data = [], array $terms = []): Entry
{
    $thisTest = test();
    $thisTest->post('/admin/cms/collections/products/entries', [
        'title' => $name, 'slug' => str($name)->slug()->value(),
        'data' => ['product' => ['variants' => [['price' => 60000]]], ...$data],
    ])->assertSessionHasNoErrors();
    $entry = Entry::query()->latest('id')->firstOrFail();
    $thisTest->post("/admin/cms/entries/{$entry->id}/publish", ['locale' => 'id'])->assertSessionHasNoErrors();
    $entry->terms()->sync($terms);

    return $entry;
}

it('inherits product content per field and makes size guide visibility opt-in', function () {
    $category = term('product_categories', 'Shirts');
    $brand = term('brands', 'Label');
    $shirts = saveCatalogContentProduct('Shirt', terms: [$category->id]);
    $branded = saveCatalogContentProduct('Branded shirt', terms: [$category->id, $brand->id]);
    $custom = saveCatalogContentProduct('Custom shirt', [
        'specifications' => [['label' => 'Material', 'value' => 'Custom wool']],
        'faq' => [['question' => 'Sleeves?', 'answer' => 'Custom answer']],
        'size_guide' => '<p>Individual measurements</p>',
        'commerce_presentation' => ['size_guide_visibility' => 'show'],
    ], [$category->id, $brand->id]);

    $this->put('/admin/commerce/settings/catalog', ['values' => [
        'specifications' => [['label' => 'Material', 'value' => 'Store linen']],
        'faq' => [['question' => 'Washing?', 'answer' => 'Store washing instructions']],
        'size_guide' => '<p>Store measurements</p>',
        'category_defaults' => [[
            'term' => (string) $category->id, 'specifications' => [['label' => 'Material', 'value' => 'Category cotton']],
            'size_guide_visibility' => 'show', 'size_guide' => '<p>Category measurements</p>',
        ]],
        'brand_defaults' => [[
            'term' => (string) $brand->id, 'specifications' => [['label' => 'Material', 'value' => 'Brand silk']],
            'size_guide_visibility' => 'hide',
        ]],
    ]])->assertSessionHasNoErrors();

    $plain = saveCatalogContentProduct('Plain item', ['size_guide' => '<p>Hidden product measurements</p>']);
    $this->get('/products/plain-item')->assertOk()->assertSee('Store linen')
        ->assertDontSee('Hidden product measurements')->assertDontSee('Store measurements');
    $this->get('/products/shirt')->assertOk()->assertSee('Category cotton')->assertSee('Store washing instructions')->assertSee('Category measurements');
    $this->get('/products/branded-shirt')->assertOk()->assertSee('Brand silk')->assertDontSee('Category measurements');
    $this->get('/products/custom-shirt')->assertOk()->assertSee('Custom wool')->assertSee('Custom answer')->assertSee('Individual measurements')
        ->assertDontSee('Store washing instructions');
    $this->post('/compare/items', ['product' => Product::query()->where('entry_id', $plain->id)->value('id')]);
    $this->post('/compare/items', ['product' => Product::query()->where('entry_id', $branded->id)->value('id')]);
    $this->get('/compare')->assertOk()->assertSee('Store linen')->assertSee('Brand silk');
});

it('preserves gallery order and shows local or YouTube videos as selected', function () {
    $media = fn (string $name, string $mime) => Media::query()->create([
        'disk' => 'public', 'path' => $name, 'filename' => $name, 'mime_type' => $mime, 'size' => 10, 'sizes' => [],
    ]);
    $first = $media('first.png', 'image/png');
    $second = $media('second.png', 'image/png');
    $video = $media('product.mp4', 'video/mp4');

    saveCatalogContentProduct('Local video', ['gallery' => [$second->id, $first->id],
        'commerce_presentation' => ['video_source' => 'local', 'video_file' => $video->id]]);
    $this->get('/products/local-video')->assertOk()->assertSeeInOrder(['second.png', 'first.png'])
        ->assertSee('<video src="'.$video->url().'" controls', false);
    saveCatalogContentProduct('YouTube video', [
        'commerce_presentation' => ['video_source' => 'external', 'video_url' => 'https://youtu.be/dQw4w9WgXcQ'],
    ]);
    $this->get('/products/youtube-video')->assertOk()->assertSee('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
});

it('upgrades existing product blueprints without moving content or overwriting custom fields', function () {
    $blueprint = Blueprint::query()->where('handle', 'product')->firstOrFail();
    $fields = [
        ['handle' => 'product', 'type' => 'commerce_product', 'label' => 'Catalog data'],
        ['handle' => 'gallery', 'type' => 'media', 'label' => 'Custom photos', 'config' => ['multiple' => true, 'types' => ['image']]],
        ['handle' => 'custom', 'type' => 'text', 'label' => 'Custom'],
    ];
    $blueprint->update(['fields' => $fields]);
    $migration = require __DIR__.'/../../../database/migrations/2026_01_19_000001_add_product_presentation_fields.php';
    $migration->up();
    $migration->up();

    $saved = $blueprint->fresh()->fields;
    expect(array_column($saved, 'handle'))->toBe(['product', 'commerce_presentation', 'gallery', 'custom'])
        ->and($saved[0])->toBe($fields[0])
        ->and($saved[2]['type'])->toBe('commerce_gallery')
        ->and($saved[2]['label'])->toBe('Custom photos')
        ->and($saved[3])->toBe($fields[2]);
});

it('appends variant-only photos once and maps each variant to its gallery slide', function () {
    $media = fn (string $name) => Media::query()->create([
        'disk' => 'public', 'path' => $name, 'filename' => $name, 'mime_type' => 'image/png', 'size' => 10, 'sizes' => [],
    ]);
    $cover = $media('gallery-cover.png');
    $other = $media('gallery-second.png');
    $variantPhoto = $media('gallery-variant.png');
    $entry = saveCatalogContentProduct('Catalogue gallery', [
        'gallery' => [$cover->id, $other->id],
        'product' => [
            'type' => 'variable', 'options' => [['id' => 'colour', 'name' => 'Colour', 'values' => [
                ['id' => 'blue', 'label' => 'Blue'], ['id' => 'black', 'label' => 'Black'], ['id' => 'grey', 'label' => 'Grey'],
            ]]],
            'variants' => [
                ['id' => 'one', 'price' => 20000, 'image' => $cover->id, 'options' => ['colour' => 'blue']],
                ['id' => 'two', 'price' => 20000, 'image' => $variantPhoto->id, 'options' => ['colour' => 'black']],
                ['id' => 'three', 'price' => 20000, 'image' => $variantPhoto->id, 'options' => ['colour' => 'grey']],
            ],
        ],
    ]);
    $variants = Product::query()->where('entry_id', $entry->id)->firstOrFail()->variants->keyBy('uid');
    $response = $this->get('/products/catalogue-gallery')->assertOk()
        ->assertSeeInOrder(['gallery-cover.png', 'gallery-second.png', 'gallery-variant.png'])
        ->assertSee('data-commerce-gallery-lightbox', false);

    expect(substr_count($response->getContent(), 'data-commerce-gallery-image'))->toBe(3);
    $response->assertSee(json_encode((object) [$variants['one']->id => 0, $variants['two']->id => 2, $variants['three']->id => 2]));
});
