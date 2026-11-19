<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Settings\StoreSettings;

it('counts the same published products as the catalog search and localizes the message', function () {
    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'one', 'sku' => 'MUG-1', 'price' => 1000, 'track_stock' => true, 'initial_stock' => 0]]], title: 'Bamboo Mug');
    $hidden = publishProduct(['variants' => [['id' => 'two', 'sku' => 'MUG-2', 'price' => 1000]]], title: 'Hidden Mug');
    unpublishEntry($hidden);

    $this->getJson('/commerce/api/product-search/count?q=mug')
        ->assertOk()->assertExactJson(['count' => 1, 'message' => 'Ditemukan 1 produk']);
    $this->get('/products?q=mug')->assertOk()->assertSee('Bamboo Mug')->assertDontSee('Hidden Mug');
    $this->getJson('/en/commerce/api/product-search/count?q=missing')
        ->assertOk()->assertExactJson(['count' => 0, 'message' => 'No products found']);
    $this->getJson('/commerce/api/product-search/count?q=MUG-1')->assertOk()->assertJsonPath('count', 1);
    $this->getJson('/commerce/api/product-search/count?q=%20%20')->assertUnprocessable()->assertJsonValidationErrors('q');

    app(StoreSettings::class)->saveSection('catalog', ['hide_out_of_stock' => true]);
    $this->getJson('/commerce/api/product-search/count?q=mug')->assertOk()->assertJsonPath('count', 0);
});
