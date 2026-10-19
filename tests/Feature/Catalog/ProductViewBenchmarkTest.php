<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Models\Entry;

/*
 * Product view build times for a page of large variable products and a
 * long cart. Skipped unless COMMERCE_BENCH=1:
 *
 *   COMMERCE_BENCH=1 vendor/bin/pest tests/Feature/Catalog/ProductViewBenchmarkTest.php
 *
 * Prints the median of a few runs, so a change can be compared before and
 * after on the same machine (SQLite in memory).
 */

beforeEach(function () {
    if (! env('COMMERCE_BENCH')) {
        $this->markTestSkipped('Set COMMERCE_BENCH=1 to run the product view benchmark.');
    }
    checkoutStore();
    $sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', '3xl', '4xl', '5xl', '6xl'];
    $colors = ['merah', 'biru', 'hijau', 'hitam', 'putih', 'kuning', 'ungu', 'abu', 'cokelat', 'krem'];
    foreach (range(1, 24) as $p) {
        $variants = [];
        foreach ($sizes as $si => $size) {
            foreach ($colors as $ci => $color) {
                $variants[] = ['id' => "p{$p}-{$size}-{$color}", 'options' => ['size' => $size, 'color' => $color], 'sku' => "B{$p}-{$size}-{$color}",
                    'price' => 100000 + 1000 * $si + 100 * $ci, 'compare_at_price' => $ci === 0 ? 150000 : null, 'track_stock' => true, 'initial_stock' => ($si + $ci) % 7];
            }
        }
        publishProduct([
            'type' => 'variable',
            'options' => [
                ['id' => 'size', 'name' => 'Ukuran', 'values' => array_map(fn ($s) => ['id' => $s, 'label' => strtoupper($s)], $sizes)],
                ['id' => 'color', 'name' => 'Warna', 'values' => array_map(fn ($c) => ['id' => $c, 'label' => ucfirst($c)], $colors)],
            ],
            'variants' => $variants,
            'tiers' => [['min_qty' => 10, 'type' => 'percent_off', 'value' => 1000]],
        ], title: "Kaos {$p}");
    }
    $sale = FlashSale::query()->create(['name' => 'Kilat', 'slug' => 'kilat', 'active' => true, 'starts_at' => now()->subHour(), 'ends_at' => now()->addDay()]);
    $sale->items()->create(['product_id' => Variant::query()->where('sku', 'B1-m-biru')->value('product_id'), 'discount_type' => 'percent_off', 'discount_value' => 1000]);
});

/** @return array{0: float, 1: int} median milliseconds and queries of one run */
function benchmark(Closure $run, int $times = 5): array
{
    $ms = [];
    $queries = 0;
    foreach (range(1, $times) as $i) {
        app()->forgetScopedInstances();
        app(ProductViewFactory::class)->flush();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $start = hrtime(true);
        $run();
        $ms[] = (hrtime(true) - $start) / 1e6;
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();
    }
    sort($ms);

    return [$ms[intdiv(count($ms), 2)], $queries];
}

it('times building views for 24 products with 100 variants each, and a 200-line cart', function () {
    $entries = Entry::query()->whereIn('id', Variant::query()->where('sku', 'like', 'B%')->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')->select('commerce_products.entry_id'))->get();
    expect($entries)->toHaveCount(24);
    $cart = cartWith(Variant::query()->where('sku', 'like', 'B%')->orderBy('id')->get()->groupBy('product_id')
        ->flatMap(fn ($variants) => $variants->take(9))->take(200)->map(fn ($v) => [$v, 1])->values()->all());
    expect($cart->items()->count())->toBe(200);

    $results = [
        'listing views (24 x 100)' => benchmark(fn () => app(ProductViewFactory::class)->forEntries($entries)),
        'listing views + read every variant row' => benchmark(fn () => array_map(fn ($v) => count($v->variants), app(ProductViewFactory::class)->forEntries($entries))),
        'cart view (200 lines)' => benchmark(fn () => CartView::for($cart->fresh())),
        'GET /products (24 cards)' => benchmark(fn () => $this->get('/products')->assertOk()),
        'GET /cart (200 lines)' => benchmark(fn () => $this->get('/cart')->assertOk()),
        'GET /products/kaos-1' => benchmark(fn () => $this->get('/products/kaos-1')->assertOk()),
    ];
    foreach ($results as $label => [$ms, $queries]) {
        fwrite(STDERR, sprintf("%-42s %9.1f ms %5d queries\n", $label, $ms, $queries));
    }
})->group('benchmark');
