<?php

declare(strict_types=1);

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Models\Entry;

/*
 * A view's picker rows (ProductView::$variants) are built the first time
 * they're read: listing cards and cart lines don't build them, and when
 * they are read they're the same as when they were built up front.
 */

/** Counts how often a view's picker rows are built. */
class CountingProductViewFactory extends ProductViewFactory
{
    public static int $built = 0;

    protected function variantRows(Product $product, Collection $variants, Collection $current, array $statuses, bool $hidden, bool $preview): array
    {
        static::$built++;

        return parent::variantRows($product, $variants, $current, $statuses, $hidden, $preview);
    }
}

/** A variable product: two options, in stock, on backorder, sold out, min/max quantities, an inactive variant. */
function colourShirt(array $overrides = []): array
{
    return array_replace([
        'type' => 'variable',
        'options' => [
            ['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M'], ['id' => 'l', 'label' => 'L']]],
            ['id' => 'color', 'name' => 'Warna', 'values' => [['id' => 'red', 'label' => 'Merah'], ['id' => 'blue', 'label' => 'Biru']]],
        ],
        'variants' => [
            ['id' => 's-red', 'options' => ['size' => 's', 'color' => 'red'], 'sku' => 'K-S-RED', 'price' => 99000, 'compare_at_price' => 129000, 'track_stock' => true, 'initial_stock' => 3],
            ['id' => 's-blue', 'options' => ['size' => 's', 'color' => 'blue'], 'sku' => 'K-S-BLUE', 'price' => 99000, 'track_stock' => true, 'initial_stock' => 0, 'backorders' => 'notify'],
            ['id' => 'm-red', 'options' => ['size' => 'm', 'color' => 'red'], 'sku' => 'K-M-RED', 'price' => 109000, 'compare_at_price' => 100000, 'stock_status' => 'out_of_stock'],
            ['id' => 'm-blue', 'options' => ['size' => 'm', 'color' => 'blue'], 'sku' => 'K-M-BLUE', 'price' => 109000, 'min_qty' => 2, 'max_qty' => 10, 'qty_step' => 2],
            ['id' => 'l-red', 'options' => ['size' => 'l', 'color' => 'red'], 'sku' => 'K-L-RED', 'price' => 119000, 'active' => false],
            ['id' => 'l-blue', 'options' => ['size' => 'l', 'color' => 'blue'], 'sku' => 'K-L-BLUE', 'price' => 119000, 'compare_at_price' => 150000],
        ],
    ], $overrides);
}

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    CountingProductViewFactory::$built = 0;
    $this->app->scoped(ProductViewFactory::class, fn ($app) => $app->make(CountingProductViewFactory::class));
});

it('reads the same picker rows, JSON and offer count as when they were built up front', function () {
    $entry = publishProduct(colourShirt(), title: 'Kaos Warna');
    $sku = Variant::query()->pluck('id', 'sku');
    // A flash sale on one variant: its row has the sale price.
    $sale = FlashSale::query()->create(['name' => 'Kilat', 'slug' => 'kilat', 'active' => true, 'starts_at' => now()->subHour(), 'ends_at' => now()->addDay()]);
    $sale->items()->create(['product_id' => Variant::query()->find($sku['K-L-BLUE'])->product_id, 'variant_id' => $sku['K-L-BLUE'], 'discount_type' => 'percent_off', 'discount_value' => 1000]);
    app()->forgetScopedInstances();

    $view = commerce_product($entry);
    expect(CountingProductViewFactory::$built)->toBe(0);

    // Captured from the factory before rows were built lazily.
    $rows = [
        ['id' => $sku['K-S-RED'], 'uid' => 's-red', 'title' => 'S / Merah', 'sku' => 'K-S-RED', 'options' => ['size' => 's', 'color' => 'red'], 'price' => 99000, 'price_formatted' => 'Rp99.000', 'compare_at' => 'Rp129.000', 'stock' => 'in_stock', 'min_qty' => 1, 'max_qty' => null, 'qty_step' => 1, 'image' => null],
        ['id' => $sku['K-S-BLUE'], 'uid' => 's-blue', 'title' => 'S / Biru', 'sku' => 'K-S-BLUE', 'options' => ['size' => 's', 'color' => 'blue'], 'price' => 99000, 'price_formatted' => 'Rp99.000', 'compare_at' => null, 'stock' => 'backorder', 'min_qty' => 1, 'max_qty' => null, 'qty_step' => 1, 'image' => null],
        ['id' => $sku['K-M-RED'], 'uid' => 'm-red', 'title' => 'M / Merah', 'sku' => 'K-M-RED', 'options' => ['size' => 'm', 'color' => 'red'], 'price' => 109000, 'price_formatted' => 'Rp109.000', 'compare_at' => null, 'stock' => 'out_of_stock', 'min_qty' => 1, 'max_qty' => null, 'qty_step' => 1, 'image' => null],
        ['id' => $sku['K-M-BLUE'], 'uid' => 'm-blue', 'title' => 'M / Biru', 'sku' => 'K-M-BLUE', 'options' => ['size' => 'm', 'color' => 'blue'], 'price' => 109000, 'price_formatted' => 'Rp109.000', 'compare_at' => null, 'stock' => 'in_stock', 'min_qty' => 2, 'max_qty' => 10, 'qty_step' => 2, 'image' => null],
        ['id' => $sku['K-L-BLUE'], 'uid' => 'l-blue', 'title' => 'L / Biru', 'sku' => 'K-L-BLUE', 'options' => ['size' => 'l', 'color' => 'blue'], 'price' => 107100, 'price_formatted' => 'Rp107.100', 'compare_at' => 'Rp150.000', 'stock' => 'in_stock', 'min_qty' => 1, 'max_qty' => null, 'qty_step' => 1, 'image' => null],
    ];
    $options = [
        ['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M'], ['id' => 'l', 'label' => 'L']]],
        ['id' => 'color', 'name' => 'Warna', 'values' => [['id' => 'red', 'label' => 'Merah'], ['id' => 'blue', 'label' => 'Biru']]],
    ];

    expect($view->variants)->toBe($rows)
        ->and($view->options)->toBe($options)
        ->and($view->variantsJson())->toBe((string) json_encode(['options' => $options, 'variants' => $rows], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE))
        ->and($view->jsonSerialize()['variants'])->toBe($rows)
        ->and($view->structuredData()['offers'])->toMatchArray(['@type' => 'AggregateOffer', 'lowPrice' => '99000', 'highPrice' => '109000', 'offerCount' => 5])
        ->and($view->price)->toMatchArray(['isRange' => true, 'from' => 99000, 'to' => 109000, 'formatted' => 'Rp99.000 – Rp109.000'])
        ->and($view->stock['status'])->toBe('in_stock')
        ->and($view->badges)->toBe(['sale', 'new'])
        ->and($view->defaultVariant()?->sku)->toBe('K-S-RED')
        ->and(CountingProductViewFactory::$built)->toBe(1); // read four times, built once
});

it('does not build picker rows for listing cards or cart lines', function () {
    foreach (range(1, 3) as $i) {
        publishProduct(colourShirt(['variants' => array_map(fn (array $v) => [...$v, 'id' => "{$v['id']}-{$i}", 'sku' => "{$v['sku']}-{$i}"], colourShirt()['variants'])]), title: "Kaos {$i}");
    }
    $cart = cartWith(Variant::query()->where('active', true)->get()->map(fn ($v) => [$v, 1])->all());

    DB::enableQueryLog();
    $this->get('/products')->assertOk()->assertSee('Kaos 3')->assertSee('Rp99.000 – Rp119.000');
    $this->get('/cart')->assertOk()->assertSee('Kaos 2')->assertSee('M / Biru');
    $optionValueQueries = collect(DB::getQueryLog())->filter(fn (array $q) => str_contains($q['query'], 'commerce_variant_option_values'));

    expect(CountingProductViewFactory::$built)->toBe(0)
        ->and($optionValueQueries)->toBeEmpty()
        ->and($cart->items()->count())->toBe(15);
});

it('builds the rows on the product page, where the picker reads them', function () {
    publishProduct(colourShirt(), title: 'Kaos Warna');

    $this->get('/products/kaos-warna')->assertOk()
        ->assertSee('data-commerce-picker', false)
        ->assertSee('&quot;uid&quot;:&quot;m-blue&quot;', false)
        ->assertSee('"offerCount":5', false);

    expect(CountingProductViewFactory::$built)->toBe(1);
});

it('loads the option values of a whole page in one query when rows are read', function () {
    foreach (range(1, 6) as $i) {
        publishProduct(colourShirt(['variants' => array_map(fn (array $v) => [...$v, 'id' => "{$v['id']}-{$i}", 'sku' => "{$v['sku']}-{$i}"], colourShirt()['variants'])]), title: "Kaos {$i}");
    }
    $views = app(ProductViewFactory::class)->forEntries(sunrice_entries('products')->get());

    DB::flushQueryLog();
    DB::enableQueryLog();
    $options = array_map(fn (ProductView $v) => array_column($v->variants, 'options'), $views);

    expect(DB::getQueryLog())->toHaveCount(1)
        ->and(CountingProductViewFactory::$built)->toBe(6)
        ->and(array_values($options)[5][3])->toBe(['size' => 'm', 'color' => 'blue']);
});

it('keeps rows unbuilt through with() and extenders, and lets them replace the rows', function () {
    $entry = publishProduct(colourShirt(), title: 'Kaos Warna');
    ProductViewFactory::extendUsing(fn (ProductView $view) => $view->with(badges: [...$view->badges, 'featured']));
    app()->forgetScopedInstances();

    $view = commerce_product($entry);
    $copy = $view->with(tiers: []);
    expect(CountingProductViewFactory::$built)->toBe(0)
        ->and($view->hasBadge('featured'))->toBeTrue()
        ->and($copy->variants)->toBe($view->variants)
        ->and(CountingProductViewFactory::$built)->toBe(1) // the copy shares the built rows
        ->and($view->with(variants: [['uid' => 'only']])->variants)->toBe([['uid' => 'only']])
        ->and(new ProductView($view->entry, $view->product, 'variable', $view->price, [], $view->stock, $view->cta, [], [], [['uid' => 'given']])->variants)->toBe([['uid' => 'given']]);

    $restored = unserialize(serialize($copy));
    expect($restored->variants)->toBe($view->variants)->and($restored->price)->toBe($view->price);
});

it('builds preview rows from the draft options', function () {
    actingAsSuperAdmin();
    $entry = publishProduct(colourShirt(), title: 'Kaos Warna');
    $draft = colourShirt();
    $draft['variants'][3]['price'] = 59000;
    publishProduct($draft, $entry, title: 'Kaos Warna', publish: false);

    $url = URL::temporarySignedRoute('sunrice.frontend.preview', now()->addMinutes(5), ['entry' => $entry->id, 'locale' => 'id']);
    $this->get($url)->assertOk()->assertSee('&quot;price&quot;:59000', false);
    $live = commerce_product(Entry::query()->find($entry->id));

    expect(collect($live->variants)->firstWhere('uid', 'm-blue'))->toMatchArray(['options' => ['size' => 'm', 'color' => 'blue'], 'price' => 109000]);
});
