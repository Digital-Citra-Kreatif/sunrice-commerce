<?php

declare(strict_types=1);

use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Sunrice\Actions\Entries\PublishTranslation;
use Sunrice\Actions\Entries\SaveDraft;
use Sunrice\Commerce\Tests\TestCase;
use Sunrice\Models\Blueprint;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Support\Locales;
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
