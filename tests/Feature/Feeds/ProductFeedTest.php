<?php

declare(strict_types=1);

use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Health\Checks\ProductFeedCheck;
use Sunrice\Commerce\Settings\StoreSettings;

beforeEach(function () {
    checkoutStore(['price' => 50000, 'compare_at_price' => 65000]);
    publishProduct(['type' => 'variable', 'options' => [['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]], 'variants' => [
        ['id' => 'v-s', 'options' => ['size' => 's'], 'sku' => 'TS-S', 'price' => 90000, 'track_stock' => true, 'initial_stock' => 0],
        ['id' => 'v-m', 'options' => ['size' => 'm'], 'sku' => 'TS-M', 'price' => 95000, 'weight' => 200],
    ]], title: 'Tee');
    publishProduct(['variants' => [['id' => 'd', 'sku' => 'DRAFT-1', 'price' => 1000]]], title: 'Draft', publish: false);
});

/** @return array<string, array<string, string>> items by g:id */
function feedItems(string $xml): array
{
    $items = [];
    foreach (simplexml_load_string($xml)->channel->item as $item) {
        $g = (array) $item->children('http://base.google.com/ns/1.0');
        $items[(string) $g['id']] = array_map('strval', $g);
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
