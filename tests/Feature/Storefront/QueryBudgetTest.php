<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Variant;

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
