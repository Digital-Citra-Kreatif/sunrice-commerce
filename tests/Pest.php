<?php

declare(strict_types=1);

use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Actions\Entries\SaveDraft;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Commerce;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Regions\RegionImporter;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Models\ShippingMethod;
use Sunrice\Commerce\Shipping\Models\ShippingZone;
use Sunrice\Commerce\Tests\TestCase;
use Sunrice\Models\Blueprint;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Support\Locales;
use Workbench\App\Commerce\TestTransfer;
use Workbench\App\Models\User;

uses(TestCase::class)->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Test helpers
|--------------------------------------------------------------------------
*/

/** Sign in to the admin as a user with Sunrice's Super Admin role. */
function actingAsSuperAdmin(): User
{
    $user = User::query()->create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password')]);
    $user->assignRole(Role::findOrCreate(config('sunrice.super_admin_role'), config('sunrice.auth.guard', 'web')));
    test()->actingAs($user, config('sunrice.auth.guard', 'web'));

    return $user;
}

/**
 * Sign in to the admin as a user whose role has these permissions (plus
 * sunrice.access-admin).
 *
 * @param  array<int, string>  $permissions
 */
function actingAsUserWith(array $permissions, string $email = 'staff@example.com'): User
{
    test()->artisan('sunrice:sync-permissions');
    $role = Role::findOrCreate('Role '.md5($email), config('sunrice.auth.guard', 'web'));
    $role->givePermissionTo(['sunrice.access-admin', ...$permissions]);
    $user = User::query()->create(['name' => 'Staff', 'email' => $email, 'password' => bcrypt('password')]);
    $user->assignRole($role);
    test()->actingAs($user, config('sunrice.auth.guard', 'web'));

    return $user;
}

/** The products collection with a blueprint holding the product field. */
function productCollection(): Collection
{
    $existing = Collection::query()->where('handle', 'products')->first();
    if ($existing !== null) {
        return $existing;
    }
    $blueprint = Blueprint::query()->create(['handle' => 'product', 'title' => 'Product', 'fields' => [
        ['handle' => 'product', 'type' => 'commerce_product', 'label' => 'Product'],
    ]]);

    return Collection::query()->create(['handle' => 'products', 'title' => 'Products', 'blueprint_id' => $blueprint->id, 'settings' => ['route' => 'products/{slug}']]);
}

/**
 * Save a product entry's draft and publish it (Sunrice's own actions), or
 * only save the draft.
 *
 * @param  array<string, mixed>  $value  the product field value
 */
function publishProduct(array $value, ?Entry $entry = null, string $title = 'T-shirt', bool $publish = true): Entry
{
    $collection = productCollection();
    $entry ??= Entry::query()->create(['collection_id' => $collection->id, 'status' => 'draft', 'sort_order' => 0]);
    $translation = $entry->translations()->firstOrCreate(['locale' => Locales::main()], [
        'collection_id' => $collection->id, 'title' => $title, 'slug' => Str::slug($title), 'data' => [], 'seo' => [],
    ]);
    app(SaveDraft::class)->handle($translation, ['title' => $title, 'slug' => Str::slug($title), 'data' => ['product' => $value]]);
    if ($publish) {
        app(PublishTranslation::class)->handle($translation->fresh());
    }

    return $entry->fresh();
}

/**
 * An order row with sensible defaults (no items), for state and admin tests.
 *
 * @param  array<string, mixed>  $attributes
 */
function makeOrder(array $attributes = []): Order
{
    static $n = 0;
    $n++;

    return Order::query()->create([
        'type' => 'order',
        'number' => 'ORD-TEST-'.$n.'-'.Str::random(4),
        'order_key' => Str::random(40),
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'fulfillment_status' => 'unfulfilled',
        'email' => 'buyer@example.com',
        'customer_name' => 'Buyer',
        'currency' => 'IDR',
        'subtotal' => 100000,
        'total' => 100000,
        'placed_at' => now(),
        ...$attributes,
    ]);
}

/**
 * A store ready for checkout: regions, a "Mug" (50.000, 500 g, 5 in
 * stock), shipping to Indonesia at a flat 10.000, and the test transfer
 * payment method. Returns the mug variant.
 */
function checkoutStore(array $mug = []): Variant
{
    (new RegionImporter(__DIR__.'/Fixtures/regions'))->import(4);
    app(ScaffoldStore::class)->handle();
    publishProduct(['variants' => [['id' => 'mug', 'sku' => 'MUG', 'price' => 50000, 'weight' => 500, 'track_stock' => true, 'initial_stock' => 5, ...$mug]]], title: 'Mug');
    $zone = ShippingZone::query()->create(['name' => 'Indonesia']);
    $zone->regions()->create(['country' => 'ID']);
    $zone->methods()->create(['type' => 'flat', 'title' => ['id' => 'Reguler', 'en' => 'Regular'], 'settings' => ['cost' => 10000], 'active' => true]);
    app(Commerce::class)->registerPaymentMethod(TestTransfer::class);
    app(StoreSettings::class)->saveSection('payments', ['methods' => ['test_transfer' => ['active' => true, 'title' => ['id' => 'Transfer', 'en' => 'Transfer'], 'deadline_hours' => 24]]]);
    app()->forgetScopedInstances();

    return Variant::query()->where('sku', 'MUG')->firstOrFail();
}

/** Checkout input for a Bandung address with the flat rate and the test transfer. @return array<string, mixed> */
function checkoutInput(array $overrides = []): array
{
    $method = ShippingMethod::query()->where('type', 'flat')->value('id');

    return array_replace_recursive([
        'name' => 'Rina', 'email' => 'rina@example.com', 'phone' => '0812 3456 7890',
        'shipping_address' => ['name' => 'Rina', 'phone' => '0812 3456 7890', 'country' => 'ID', 'province_code' => '32', 'city_code' => '32.73',
            'district_code' => '32.73.01', 'line1' => 'Jl. Sarijadi 1'],
        'billing_same' => '1',
        'shipping_rate' => "flat:{$method}:default",
        'payment_method' => 'test_transfer',
    ], $overrides);
}

/** A guest cart with these lines, sent as the visitor's cookie on the next requests. */
function cartWith(array $lines): Cart
{
    $cart = Cart::query()->create(['token' => Str::random(64), 'status' => 'active', 'currency' => 'IDR', 'last_activity_at' => now()]);
    foreach ($lines as [$variant, $qty]) {
        $cart->items()->create(['variant_id' => $variant->id, 'quantity' => $qty]);
    }
    test()->withCookie((string) config('commerce.cart.cookie', 'commerce_cart'), $cart->token);

    return $cart;
}
