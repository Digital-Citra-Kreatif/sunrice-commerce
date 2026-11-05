<?php

declare(strict_types=1);

use Sunrice\Cms\Events\ContentChanged;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductViewHooks;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Health\Checks\ProductFeedCheck;
use Sunrice\Commerce\Inventory\Actions\AdjustStock;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    checkoutStore(['price' => 50000, 'compare_at_price' => 65000]);
    publishProduct(['type' => 'variable', 'options' => [['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]], 'variants' => [
        ['id' => 'v-s', 'options' => ['size' => 's'], 'sku' => 'TS-S', 'price' => 90000, 'track_stock' => true, 'initial_stock' => 0],
        ['id' => 'v-m', 'options' => ['size' => 'm'], 'sku' => 'TS-M', 'price' => 95000, 'weight' => 200],
    ]], title: 'Tee');
    publishProduct(['variants' => [['id' => 'd', 'sku' => 'DRAFT-1', 'price' => 1000]]], title: 'Draft', publish: false);
});

/** @return array<string, array<string, string>> items by the SKU of their variant (g:id is the variant's id) */
function feedItems(string $xml): array
{
    $skus = Variant::query()->pluck('sku', 'id');
    $items = [];
    foreach (simplexml_load_string($xml)->channel->item as $item) {
        $g = array_map('strval', (array) $item->children('http://base.google.com/ns/1.0'));
        $items[(string) $skus[(int) substr($g['id'], 1)]] = $g;
    }

    return $items;
}

it('lists every buyable variant for Google Merchant Center and Meta', function () {
    $this->get('/feeds/products.xml')->assertNotFound();
    app(ToggleFeature::class)->handle('product_feeds', true);

    $response = $this->get('/feeds/products.xml')->assertOk()->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
    $items = feedItems($response->getContent());

    expect(array_keys($items))->toEqualCanonicalizing(['MUG', 'TS-S', 'TS-M'])
        ->and($items['MUG'])->toMatchArray(['title' => 'Mug', 'link' => url('/products/mug'), 'price' => '65000 IDR', 'sale_price' => '50000 IDR',
            'availability' => 'in_stock', 'condition' => 'new', 'shipping_weight' => '500 g'])
        ->and($items['MUG'])->not->toHaveKey('item_group_id')
        ->and($items['MUG']['id'])->toBe('V'.Variant::query()->where('sku', 'MUG')->value('id'))
        ->and($items['TS-S'])->toMatchArray(['title' => 'Tee — S', 'availability' => 'out_of_stock', 'price' => '90000 IDR'])
        ->and($items['TS-M']['item_group_id'])->toBe($items['TS-S']['item_group_id'])
        ->and($items['TS-M'])->not->toHaveKey('sale_price');
    expect((new ProductFeedCheck)->run()->message)->toContain(url('/feeds/products.xml'));
});

it('lists nothing whose price is hidden', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'nobody']);

    expect(feedItems($this->get('/feeds/products.xml')->assertOk()->getContent()))->toBe([]);
});

it('compares a flash sale or discount with the regular price, as the store shows it', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    app(ProductViewHooks::class)->priceAdjusters[] = fn ($variant, int $price) => $variant->sku === 'TS-M' ? 80000 : $price;

    $items = feedItems($this->get('/feeds/products.xml')->getContent());

    expect($items['TS-M'])->toMatchArray(['price' => '95000 IDR', 'sale_price' => '80000 IDR']);
});

it('is built as a guest sees the store, whoever asks first', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'signed_in']);
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'secret-pass', 'email_verified_at' => now()]);

    $signedIn = $this->actingAs($user, 'commerce')->get('/feeds/products.xml')->assertOk()->getContent();
    expect(feedItems($signedIn))->toBe([]);
});

it('is built again when a product or its stock changes', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    expect(feedItems($this->get('/feeds/products.xml')->getContent())['MUG']['availability'])->toBe('in_stock');

    // Sold out: a product that can't be added to the cart leaves the feed.
    app(AdjustStock::class)->handle(Variant::query()->where('sku', 'MUG')->sole(), 0, set: true);
    expect(feedItems($this->get('/feeds/products.xml')->getContent()))->not->toHaveKey('MUG')->toHaveKey('TS-M');

    // Taken off in the CMS, which then tells the site its content changed.
    unpublishEntry($tee = Product::query()->whereHas('variants', fn ($q) => $q->where('sku', 'TS-M'))->sole()->entry_id);
    ContentChanged::dispatch('entry '.$tee);
    expect(feedItems($this->get('/feeds/products.xml')->getContent()))->not->toHaveKey('TS-M');
});

it('weighs a bundle by its components', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    $mug = Variant::query()->where('sku', 'MUG')->sole();
    publishProduct(['type' => 'bundle', 'variants' => [['id' => 'gift', 'sku' => 'GIFT', 'price' => 90000]],
        'bundle' => ['pricing' => 'fixed', 'value' => 0, 'items' => [['variant_id' => $mug->id, 'quantity' => 2]]]], title: 'Gift set');

    expect(feedItems($this->get('/feeds/products.xml')->getContent())['GIFT']['shipping_weight'])->toBe('1000 g');
});

it('is built again when store settings change, so newly hidden prices leave it', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    expect(feedItems($this->get('/feeds/products.xml')->getContent()))->toHaveKey('MUG');

    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'signed_in']);
    expect(feedItems($this->get('/feeds/products.xml')->getContent()))->toBe([]);
});

it('is built again when the components of a bundle run short', function () {
    app(ToggleFeature::class)->handle('product_feeds', true);
    $mug = Variant::query()->where('sku', 'MUG')->sole();
    publishProduct(['type' => 'bundle', 'variants' => [['id' => 'gift', 'sku' => 'GIFT', 'price' => 90000]],
        'bundle' => ['pricing' => 'fixed', 'value' => 0, 'items' => [['variant_id' => $mug->id, 'quantity' => 2]]]], title: 'Gift set');
    expect(feedItems($this->get('/feeds/products.xml')->getContent()))->toHaveKey('GIFT');

    // 1 left: no threshold crossed for the mug, but the bundle of two can't be bought.
    app(AdjustStock::class)->handle($mug->fresh(), 1, set: true);
    expect(feedItems($this->get('/feeds/products.xml')->getContent()))->not->toHaveKey('GIFT')->toHaveKey('MUG');
});
