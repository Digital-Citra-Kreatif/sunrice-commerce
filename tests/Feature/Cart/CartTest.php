<?php

declare(strict_types=1);

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Sunrice\Commerce\Cart\Actions\AddToCart;
use Sunrice\Commerce\Cart\Actions\MergeCarts;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Settings\StoreSettings;
use Workbench\App\Models\User;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000, 'track_stock' => true, 'initial_stock' => 5, 'max_qty' => 4]]], title: 'Mug');
    publishProduct(['variants' => [['id' => 'tea', 'sku' => 'TEA', 'price' => 25000, 'min_qty' => 2]]], title: 'Tea');
    $this->mug = Variant::query()->where('sku', 'MUG')->firstOrFail();
    $this->tea = Variant::query()->where('sku', 'TEA')->firstOrFail();
});

it('adds through the purchasability check and refuses each reason', function () {
    $add = app(AddToCart::class);
    $add->handle($this->mug->id, 2);
    $add->handle($this->mug->id, 1);
    $item = $add->handle($this->tea->id, 1); // the minimum is added

    expect(app(CartManager::class)->current()->items->pluck('quantity', 'variant_id')->all())->toBe([$this->mug->id => 3, $this->tea->id => 2]);
    expect(fn () => $add->handle($this->mug->id, 2))->toThrow(CartException::class, 'choose a valid quantity'); // max 4
    expect(fn () => $add->handle(999, 1))->toThrow(CartException::class);

    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'signed_in']);
    app()->forgetScopedInstances();
    expect(fn () => app(AddToCart::class)->handle($this->tea->id, 2))->toThrow(CartException::class, 'Sign in');
});

it('notices price changes since the customer last saw the cart', function () {
    app(AddToCart::class)->handle($this->mug->id, 1);
    $cart = app(CartManager::class)->current();
    CartView::for($cart)->acknowledgePrices();

    Variant::query()->whereKey($this->mug->id)->update(['price' => 55000]);
    app()->forgetScopedInstances();
    $view = CartView::for($cart->fresh());
    expect(array_column($view->state->notices, 'code'))->toBe(['price_changed'])
        ->and($view->state->notices[0]['message'])->toBe('The price of Mug changed from Rp50.000 to Rp55.000.');
});

it('merges a guest cart into the customer\'s at sign-in', function () {
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    $customer = Customer::forUser($user);
    $mine = Cart::query()->create(['token' => str_repeat('a', 64), 'customer_id' => $customer->id, 'status' => 'active', 'vouchers' => ['A']]);
    $mine->items()->create(['variant_id' => $this->mug->id, 'quantity' => 3]);
    $guest = Cart::query()->create(['token' => str_repeat('b', 64), 'status' => 'active', 'vouchers' => ['B']]);
    $guest->items()->create(['variant_id' => $this->mug->id, 'quantity' => 3]);
    $guest->items()->create(['variant_id' => $this->tea->id, 'quantity' => 2]);

    $merged = app(MergeCarts::class)->handle($guest, $customer);

    expect($merged->id)->toBe($mine->id)
        ->and($merged->items()->pluck('quantity', 'variant_id')->all())->toBe([$this->mug->id => 4, $this->tea->id => 2]) // clamped to max 4
        ->and($merged->vouchers)->toBe(['A', 'B'])
        ->and($guest->fresh()->status)->toBe('merged');
});

it('prunes abandoned carts', function () {
    $old = Cart::query()->create(['token' => str_repeat('c', 64), 'status' => 'active', 'last_activity_at' => now()->subDays(31)]);
    $older = Cart::query()->create(['token' => str_repeat('d', 64), 'status' => 'abandoned', 'last_activity_at' => now()->subDays(61)]);
    $fresh = Cart::query()->create(['token' => str_repeat('e', 64), 'status' => 'active', 'last_activity_at' => now()]);
    $converted = Cart::query()->create(['token' => str_repeat('f', 64), 'status' => 'converted', 'last_activity_at' => now()->subDays(90)]);

    $this->artisan('commerce:prune')->assertSuccessful();
    expect($old->fresh()->status)->toBe('abandoned')
        ->and($older->fresh())->toBeNull()
        ->and($fresh->fresh()->status)->toBe('active')
        ->and($converted->fresh())->not->toBeNull();
});

it('works without JavaScript: forms with flash messages', function () {
    $this->post('/cart/items', ['variant' => $this->mug->id, 'quantity' => 2])
        ->assertRedirect()->assertSessionHas('commerce.success', 'Mug ditambahkan ke keranjang.')->assertCookie('commerce_cart');
    $cart = Cart::query()->firstOrFail();
    $cookie = ['commerce_cart' => $cart->token];
    $item = $cart->items->first();

    $this->withCookies($cookie)->get('/cart')->assertOk()->assertSee('Mug')->assertSee('Rp100.000');
    $this->withCookies($cookie)->patch("/cart/items/{$item->id}", ['quantity' => 9])->assertSessionHas('commerce.error');
    $this->withCookies($cookie)->patch("/cart/items/{$item->id}", ['quantity' => 3])->assertSessionHas('commerce.success');
    expect($item->fresh()->quantity)->toBe(3);

    Voucher::query()->create(['name' => 'Hemat', 'code' => 'HEMAT', 'type' => 'percent', 'value' => 1000]);
    $this->withCookies($cookie)->post('/cart/vouchers', ['code' => 'nope'])->assertSessionHas('commerce.error', 'Kode NOPE tidak ditemukan.');
    $this->withCookies($cookie)->post('/cart/vouchers', ['code' => 'hemat'])->assertSessionHas('commerce.success', 'Kode HEMAT dipakai.');
    $this->withCookies($cookie)->get('/cart')->assertSee('Hemat')->assertSee('-Rp15.000')->assertSee('Rp135.000');

    $this->withCookies($cookie)->delete("/cart/items/{$item->id}")->assertSessionHas('commerce.success');
    $this->withCookies($cookie)->get('/cart')->assertSee('Keranjang Anda kosong.');
});

it('serves the cart as JSON', function () {
    $this->withCredentials();
    $this->postJson('/commerce/api/cart/items', ['variant' => $this->mug->id])->assertOk()
        ->assertJsonPath('cart.count', 1)->assertJsonPath('cart.lines.0.sku', 'MUG')->assertJsonPath('cart.totals.total.formatted', 'Rp50.000');
    $token = Cart::query()->value('token');

    $this->withCookies(['commerce_cart' => $token])->postJson('/commerce/api/cart/items', ['variant' => $this->mug->id, 'quantity' => 10])
        ->assertStatus(422)->assertJsonPath('reason', 'qty_rules');
    $this->withCookies(['commerce_cart' => $token])->getJson('/commerce/api/cart')->assertJsonPath('cart.lines.0.quantity', 1);
});

it('needs CSRF on cart forms', function () {
    $this->withMiddleware(ValidateCsrfToken::class);
    $this->app->instance('env', 'production');
    $response = $this->post('/cart/items', ['variant' => $this->mug->id]);
    $this->app->instance('env', 'testing');   // teardown must not run in "production" (it would ask to confirm)
    $response->assertStatus(419);
})->skip(fn () => ! class_exists(ValidateCsrfToken::class), 'no CSRF middleware');

it('is gone while the cart module is off, and hides the voucher field without vouchers', function () {
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'catalog']);
    app(ToggleFeature::class)->handle('cart', false);
    $this->get('/cart')->assertNotFound();
    $this->postJson('/commerce/api/cart/items', ['variant' => $this->mug->id])->assertNotFound();

    app(ToggleFeature::class)->handle('cart', true);
    app(StoreSettings::class)->saveSection('general', ['selling_mode' => 'shop']);
    app(ToggleFeature::class)->handle('vouchers', false);
    $this->post('/cart/items', ['variant' => $this->mug->id]);
    $this->withCookies(['commerce_cart' => Cart::query()->value('token')])->get('/cart')->assertOk()->assertDontSee('name="code"', false);
});
