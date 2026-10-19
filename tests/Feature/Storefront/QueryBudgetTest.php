<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Models\Entry;

/*
 * Query budgets (ARCHITECTURE.md §26): page queries must not grow with
 * the number of products or cart lines, and stay under a ceiling.
 */

function queriesFor(Closure $run): int
{
    DB::flushQueryLog();
    DB::enableQueryLog();
    $run();
    $count = count(DB::getQueryLog());
    DB::disableQueryLog();

    return $count;
}

beforeEach(function () {
    $this->freezeTime(); // carts touch last_activity_at when it has aged
    $this->withoutMiddleware(ValidateCsrfToken::class);
    checkoutStore();
    foreach (range(1, 12) as $i) {
        publishProduct(['variants' => [['id' => "p{$i}", 'sku' => "P{$i}", 'price' => 10000 + $i, 'track_stock' => true, 'initial_stock' => 5]]], title: "Produk {$i}");
    }
});

it('keeps the listing flat in the number of products', function () {
    $this->get('/products')->assertOk();
    $twelve = queriesFor(fn () => $this->get('/products')->assertOk());
    foreach (range(13, 24) as $i) {
        publishProduct(['variants' => [['id' => "p{$i}", 'sku' => "P{$i}", 'price' => 10000 + $i]]], title: "Produk {$i}");
    }
    $this->get('/products')->assertOk();

    expect(queriesFor(fn () => $this->get('/products')->assertOk()))->toBe($twelve)
        ->and($twelve)->toBeLessThanOrEqual(20);
});

it('keeps the product page under budget', function () {
    $this->get('/products/mug')->assertOk();

    // 16 to render, plus 2 after the response to count the view.
    expect(queriesFor(fn () => $this->get('/products/mug')->assertOk()))->toBeLessThanOrEqual(18);
});

it('keeps the cart and checkout flat in the number of lines', function () {
    $measure = function (int $lines): array {
        $cart = cartWith(Variant::query()->limit($lines)->get()->map(fn ($v) => [$v, 1])->all());
        $this->get('/cart')->assertOk(); // first view stores the prices seen
        $cartQueries = queriesFor(fn () => $this->get('/cart')->assertOk());
        $cart->update(['checkout' => checkoutInput()]);
        $checkoutQueries = queriesFor(fn () => $this->get('/checkout')->assertOk());
        $cart->items()->delete();
        $cart->delete();
        $this->flushSession();

        return [$cartQueries, $checkoutQueries];
    };
    [$cartTwo, $checkoutTwo] = $measure(2);
    [$cartTen, $checkoutTen] = $measure(10);

    expect($cartTen)->toBe($cartTwo)->toBeLessThanOrEqual(26)
        ->and($checkoutTen)->toBe($checkoutTwo)->toBeLessThanOrEqual(28);
});

it('reads variant option values only where the picker shows them', function () {
    $optionValueQueries = function (string $url): int {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->get($url)->assertOk();
        $count = collect(DB::getQueryLog())->filter(fn (array $q) => str_contains($q['query'], 'commerce_variant_option_values'))->count();
        DB::disableQueryLog();

        return $count;
    };
    foreach (range(1, 3) as $i) {
        publishProduct(['type' => 'variable',
            'options' => [['id' => 'size', 'name' => 'Ukuran', 'values' => [['id' => 's', 'label' => 'S'], ['id' => 'm', 'label' => 'M']]]],
            'variants' => [['id' => "k{$i}s", 'options' => ['size' => 's'], 'sku' => "K{$i}-S", 'price' => 99000], ['id' => "k{$i}m", 'options' => ['size' => 'm'], 'sku' => "K{$i}-M", 'price' => 109000]],
        ], title: "Kaos {$i}");
    }
    $cart = cartWith(Variant::query()->where('sku', 'like', 'K%')->get()->map(fn ($v) => [$v, 1])->all());
    $cart->update(['checkout' => checkoutInput()]);

    expect($optionValueQueries('/products'))->toBe(0)
        ->and($optionValueQueries('/cart'))->toBe(0)
        ->and($optionValueQueries('/checkout'))->toBe(0)
        ->and($optionValueQueries('/products/kaos-2'))->toBe(1);
});

/**
 * A larger store's mix: bundles (their components' prices, stock and
 * publication), a pricing rule on a category with a subcategory (each
 * product's terms) and a running flash sale.
 */
function largeStoreMix(int $bundles): void
{
    static $parent = null;
    if ($bundles === 0 || $parent === null) {
        $parent = term('product_categories', 'Kopi');
        $child = term('product_categories', 'Arabika', $parent);
        PriceRule::query()->create(['name' => 'Grosir', 'scope' => 'categories', 'tiers' => [['min_qty' => 3, 'type' => 'percent_off', 'value' => 500]]])
            ->targets()->create(['target_type' => 'term', 'target_id' => $parent->id]);
        $sale = FlashSale::query()->create(['name' => 'Kilat', 'slug' => 'kilat', 'active' => true, 'starts_at' => now()->subHour(), 'ends_at' => now()->addDay()]);
        $sale->items()->create(['product_id' => Variant::query()->where('sku', 'P1')->value('product_id'), 'discount_type' => 'percent_off', 'discount_value' => 1000]);
        foreach (Variant::query()->where('sku', 'like', 'P%')->with('product')->get() as $variant) {
            Entry::query()->find($variant->product->entry_id)?->terms()->attach($child->id);
        }
    }
    $existing = Variant::query()->where('sku', 'like', 'SET%')->count();
    foreach (range($existing + 1, $existing + $bundles) as $i) {
        publishProduct(['type' => 'bundle', 'variants' => [['id' => "set{$i}", 'sku' => "SET{$i}", 'price' => 0]], 'bundle' => ['pricing' => 'percent_off', 'value' => 1000,
            'items' => [['variant_id' => Variant::query()->where('sku', 'P'.$i)->value('id'), 'quantity' => 1], ['variant_id' => Variant::query()->where('sku', 'MUG')->value('id'), 'quantity' => 1]]]],
            title: "Set {$i}");
    }
}

it('keeps the listing flat with bundles, category pricing rules and a flash sale', function () {
    largeStoreMix(2);
    $this->get('/products')->assertOk();
    $few = queriesFor(fn () => $this->get('/products')->assertOk());
    largeStoreMix(6);
    $this->get('/products')->assertOk();

    expect(queriesFor(fn () => $this->get('/products')->assertOk()))->toBe($few);
});

it('keeps a category page flat in the number of subcategories', function () {
    $root = term('product_categories', 'Kopi');
    $measure = function () use ($root): int {
        $this->get('/products?category[]='.$root->id)->assertOk();

        return queriesFor(fn () => $this->get('/products?category[]='.$root->id)->assertOk());
    };
    $level = term('product_categories', 'Arabika', $root);
    $two = $measure();
    foreach (range(1, 4) as $i) {
        $level = term('product_categories', "Arabika {$i}", $level);
        term('product_categories', "Robusta {$i}", $root);
    }

    expect($measure())->toBe($two);
});

it('keeps the cart and checkout flat with bundles, category pricing rules and a flash sale', function () {
    largeStoreMix(8);
    $measure = function (int $lines): array {
        $variants = Variant::query()->whereIn('sku', [...array_map(fn ($i) => "SET{$i}", range(1, $lines / 2)), ...array_map(fn ($i) => 'P'.($i + 4), range(1, $lines / 2))])->get();
        $cart = cartWith($variants->map(fn ($v) => [$v, 1])->all());
        $this->get('/cart')->assertOk();
        $cartQueries = queriesFor(fn () => $this->get('/cart')->assertOk());
        $cart->update(['checkout' => checkoutInput()]);
        $checkoutQueries = queriesFor(fn () => $this->get('/checkout')->assertOk());
        $cart->items()->delete();
        $cart->delete();
        $this->flushSession();

        return [$cartQueries, $checkoutQueries];
    };
    [$cartFew, $checkoutFew] = $measure(2);
    [$cartMany, $checkoutMany] = $measure(10);

    expect($cartMany)->toBe($cartFew)->and($checkoutMany)->toBe($checkoutFew);
});

it('places an order without reading each line\'s entry and options separately', function () {
    config(['honeypot.enabled' => false]);
    $place = function (int $lines): int {
        $cart = cartWith(Variant::query()->where('sku', 'like', 'P%')->orderBy('id')->limit($lines)->get()->map(fn ($v) => [$v, 1])->all());
        $input = checkoutInput();
        $hash = seenHash($cart, $input);
        $count = queriesFor(fn () => $this->post('/checkout', [...$input, 'action' => 'place', 'totals_hash' => $hash])->assertRedirect());
        $this->flushSession();

        return $count;
    };
    $two = $place(2);
    $ten = $place(10);

    // Each line still writes its item and takes its stock (update, read back, movement) and refreshes its product's stock flag.
    expect(($ten - $two) / 8)->toBeLessThanOrEqual(6);
});
