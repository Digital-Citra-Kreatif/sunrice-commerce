<?php

declare(strict_types=1);

use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Wishlist\Wishlist;
use Sunrice\Commerce\Wishlist\WishlistManager;
use Workbench\App\Models\User;

beforeEach(function () {
    app(ScaffoldStore::class)->handle();
    $this->mug = publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000]]], title: 'Mug');
    $this->tea = publishProduct(['variants' => [['id' => 'tea', 'sku' => 'TEA', 'price' => 25000]]], title: 'Tea');
    $this->mugId = Product::query()->where('entry_id', $this->mug->id)->value('id');
    $this->teaId = Product::query()->where('entry_id', $this->tea->id)->value('id');
});

it('keeps a guest wishlist and shares it read-only', function () {
    $this->withCredentials();
    $this->post('/wishlist/items', ['product' => $this->mugId])->assertSessionHas('commerce.success')->assertCookie('commerce_wishlist');
    $wishlist = Wishlist::query()->firstOrFail();
    $this->withCookies(['commerce_wishlist' => $wishlist->token]);

    $this->post('/wishlist/items', ['product' => $this->mugId]); // once only
    $this->postJson('/wishlist/items', ['product' => $this->teaId])->assertOk()->assertJsonPath('count', 2);
    $this->get('/wishlist')->assertOk()->assertSee('Mug')->assertSee('Tea');

    $this->get("/wishlist/shared/{$wishlist->share_token}")->assertNotFound();
    $this->post('/wishlist/share', ['on' => 1]);
    $this->flushSession();
    $this->withCookies([])->get("/wishlist/shared/{$wishlist->share_token}")->assertOk()->assertSee('Mug')->assertDontSee('commerce.wishlist.remove');

    $this->delete("/wishlist/items/{$this->teaId}");
    expect($wishlist->items()->count())->toBe(1);
});

it('merges a guest wishlist into the customer\'s', function () {
    $user = User::query()->create(['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'x']);
    $customer = Customer::forUser($user);
    $mine = Wishlist::query()->create(['customer_id' => $customer->id, 'share_token' => 'mine']);
    $mine->items()->create(['product_id' => $this->mugId]);
    $guest = Wishlist::query()->create(['token' => str_repeat('g', 64), 'share_token' => 'guest']);
    $guest->items()->create(['product_id' => $this->mugId]);
    $guest->items()->create(['product_id' => $this->teaId]);

    $merged = app(WishlistManager::class)->merge($guest, $customer);

    expect($merged->id)->toBe($mine->id)->and($merged->items()->pluck('product_id')->sort()->values()->all())->toBe([$this->mugId, $this->teaId])
        ->and(Wishlist::query()->find($guest->id))->toBeNull();
});

it('limits wishlists to 200 products', function () {
    $wishlist = Wishlist::query()->create(['token' => str_repeat('h', 64), 'share_token' => 'x']);
    $products = Product::factory()->count(Wishlist::LIMIT)->create();
    foreach ($products as $product) {
        $wishlist->items()->create(['product_id' => $product->id]);
    }

    $this->withCookies(['commerce_wishlist' => $wishlist->token])->post('/wishlist/items', ['product' => $this->mugId])
        ->assertSessionHas('commerce.error', 'Wishlist sudah penuh (200 produk).');
});

it('compares products up to the maximum, matching specifications by label', function () {
    app(StoreSettings::class)->saveSection('catalog', ['compare_max' => 2, 'compare_fields' => ['sku']]);
    $mugEntry = $this->mug->mainTranslation();
    $mugEntry->update(['data' => [...$mugEntry->data, 'specifications' => [['label' => 'Bahan', 'value' => 'Keramik']]]]);
    $teaEntry = $this->tea->mainTranslation();
    $teaEntry->update(['data' => [...$teaEntry->data, 'specifications' => [['label' => 'bahan', 'value' => 'Daun']]]]);
    $third = Product::factory()->create();

    $this->post('/compare/items', ['product' => $this->mugId])->assertSessionHas('commerce.success');
    $this->post('/compare/items', ['product' => $this->teaId]);
    $this->post('/compare/items', ['product' => $third->id])->assertSessionHas('commerce.error', 'Maksimal 2 produk bisa dibandingkan.');

    $this->get('/compare')->assertOk()->assertSeeInOrder(['Mug', 'Tea'])->assertSee('Bahan')->assertSee('Keramik')->assertSee('Daun')->assertSee('MUG')->assertSee('Rp50.000');

    app(StoreSettings::class)->saveSection('catalog', ['price_visibility' => 'nobody']);
    $this->get('/compare')->assertOk()->assertDontSee('Rp50.000');
});
