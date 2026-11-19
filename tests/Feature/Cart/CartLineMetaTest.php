<?php

declare(strict_types=1);

use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\Actions\MergeCarts;
use Sunrice\Commerce\Cart\Actions\UpdateCartItem;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Workbench\App\Models\User;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000, 'track_stock' => true, 'initial_stock' => 5]]], title: 'Mug');
    $this->mug = Variant::query()->where('sku', 'MUG')->firstOrFail();
});

it('keeps the same variant with different meta on separate lines', function () {
    $add = app(AddToCart::class);
    $first = $add->handle($this->mug->id, 1, ['rental' => ['start' => '2026-12-01', 'end' => '2026-12-03']]);
    $second = $add->handle($this->mug->id, 1, ['rental' => ['start' => '2026-12-10', 'end' => '2026-12-12']]);
    $again = $add->handle($this->mug->id, 1, ['rental' => ['end' => '2026-12-03', 'start' => '2026-12-01']]); // same meta, keys in another order

    $items = app(CartManager::class)->current()->items()->orderBy('id')->get();
    expect($items)->toHaveCount(2)
        ->and($again->id)->toBe($first->id)
        ->and($items->pluck('quantity')->all())->toBe([2, 1])
        ->and($second->meta)->toBe(['rental' => ['start' => '2026-12-10', 'end' => '2026-12-12']]);

    // Each line goes into the calculation with its own meta.
    $view = CartView::for(app(CartManager::class)->current());
    expect(array_map(fn ($l) => $l->meta['rental']['start'] ?? null, array_values($view->state->lines)))->toBe(['2026-12-01', '2026-12-10']);
});

it('merges lines without meta as before', function () {
    $add = app(AddToCart::class);
    $add->handle($this->mug->id, 1);
    $add->handle($this->mug->id, 2);

    expect(app(CartManager::class)->current()->items()->pluck('quantity')->all())->toBe([3])
        ->and(CartItem::query()->value('line_key'))->toBe('');
});

it('counts every line of a variant against its stock', function () {
    $add = app(AddToCart::class);
    $add->handle($this->mug->id, 3, ['note' => 'a']);

    expect(fn () => $add->handle($this->mug->id, 3, ['note' => 'b']))->toThrow(CartException::class);
    $line = $add->handle($this->mug->id, 2, ['note' => 'b']);
    expect(fn () => app(UpdateCartItem::class)->handle($line->id, 3))->toThrow(CartException::class);
});

it('merges a guest cart line by variant and meta', function () {
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    $customer = Customer::forUser($user);
    $mine = Cart::query()->create(['token' => str_repeat('a', 64), 'customer_id' => $customer->id, 'status' => 'active']);
    $mine->items()->create(['variant_id' => $this->mug->id, 'quantity' => 1, 'meta' => ['note' => 'a']]);
    $guest = Cart::query()->create(['token' => str_repeat('b', 64), 'status' => 'active']);
    $guest->items()->create(['variant_id' => $this->mug->id, 'quantity' => 1, 'meta' => ['note' => 'a']]);
    $guest->items()->create(['variant_id' => $this->mug->id, 'quantity' => 2, 'meta' => ['note' => 'b']]);

    $merged = app(MergeCarts::class)->handle($guest, $customer);

    expect($merged->items()->orderBy('id')->get()->map(fn (CartItem $i) => [$i->meta['note'], $i->quantity])->all())
        ->toBe([['a', 2], ['b', 2]]);
});
