<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Sunrice\Commerce\Permissions\CommercePermissions;
use Sunrice\Database\Seeders\RolesSeeder;
use Sunrice\Models\Collection;
use Sunrice\Models\Form;
use Sunrice\Models\Taxonomy;
use Sunrice\Permissions\PermissionRegistry;
use Sunrice\Permissions\SyncPermissions;

/**
 * The store's roles. Permissions are only ever added, so changes made to
 * these roles in the admin are kept; run again after adding attribute
 * taxonomies (php artisan commerce:seed-roles).
 *
 * - Shop Manager: the admin, the product collections and taxonomies,
 *   assets, the inquiry form's submissions and every commerce permission.
 * - Customer: no admin permissions (the storefront role).
 * - Administrator (Sunrice's): every commerce permission too.
 */
class CommerceRolesSeeder extends Seeder
{
    public const SHOP_MANAGER = 'Shop Manager';

    public const CUSTOMER = 'Customer';

    public function run(): void
    {
        app(SyncPermissions::class)->handle();
        $guard = (string) config('sunrice.auth.guard', 'web');
        $names = app(PermissionRegistry::class)->names();

        $commerce = array_keys(CommercePermissions::all());
        $collectionIds = Collection::query()->whereIn('handle', (array) config('commerce.catalog.collections', []))->pluck('id');
        $taxonomyIds = Taxonomy::query()->whereIn('handle', array_filter([
            config('commerce.catalog.category_taxonomy'),
            config('commerce.catalog.tag_taxonomy'),
            config('commerce.catalog.brand_taxonomy'),
            ...(array) config('commerce.catalog.attribute_taxonomies', []),
        ]))->pluck('id');
        $formIds = Form::query()->where('handle', config('commerce.catalog.inquiry_form'))->pluck('id');

        $manager = RolesSeeder::match($names, [
            'sunrice.access-admin',
            'sunrice.view-drafts',
            'sunrice.guide.view',
            'sunrice.assets.view',
            'sunrice.assets.upload',
            'sunrice.assets.edit',
            ...$collectionIds->map(fn (int $id) => "sunrice.entries.{$id}.*")->all(),
            ...$taxonomyIds->map(fn (int $id) => "sunrice.terms.{$id}.*")->all(),
            ...$formIds->map(fn (int $id) => "sunrice.forms.{$id}.*-submissions")->all(),
        ]);

        Role::findOrCreate(self::SHOP_MANAGER, $guard)->givePermissionTo([...$manager, ...$commerce]);
        Role::findOrCreate(self::CUSTOMER, $guard);
        if (($administrator = Role::query()->where('name', 'Administrator')->where('guard_name', $guard)->first()) !== null) {
            $administrator->givePermissionTo($commerce);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
