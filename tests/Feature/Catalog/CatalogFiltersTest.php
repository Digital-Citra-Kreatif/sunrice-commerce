<?php

declare(strict_types=1);

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\ProductQuery;
use Sunrice\Commerce\Commerce;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'a', 'sku' => 'MUG-1', 'price' => 50000]]], title: 'Mug');
    publishProduct(['variants' => [['id' => 'b', 'sku' => 'CUP-1', 'price' => 30000]]], title: 'Cup');
    // An extension's filter: ?sku_prefix=MUG keeps products with a variant whose SKU starts with it.
    app(Commerce::class)->registerCatalogFilter('sku_prefix',
        fn (Request $r) => $r->query('sku_prefix') ? strtoupper((string) $r->query('sku_prefix')) : null,
        fn (Builder $q, mixed $prefix) => $q->whereHas('variants', fn (Builder $v) => $v->where('sku', 'like', $prefix.'%')));
});

it('narrows listings with an extension\'s filter read from the query string', function () {

    expect(ProductQuery::fromRequest(Request::create('/products'))->count())->toBe(2)
        ->and(ProductQuery::fromRequest(Request::create('/products', 'GET', ['sku_prefix' => 'mug']))->count())->toBe(1)
        ->and(ProductQuery::make()->filter('sku_prefix', 'CUP')->count())->toBe(1)
        ->and(ProductQuery::make()->filter('unknown', 'x')->count())->toBe(2)
        ->and(ProductQuery::make()->filter('sku_prefix', 'MUG')->state()['custom'])->toBe(['sku_prefix' => 'MUG']);
});

it('applies the filter to facet counts and keys their cache by it', function () {
    $all = ProductQuery::make()->facets();
    $mugs = ProductQuery::make()->filter('sku_prefix', 'MUG')->facets();

    expect($mugs['price'])->toBe(['min' => 50000, 'max' => 50000])
        ->and($all['price'])->toBe(['min' => 30000, 'max' => 50000]);
});
