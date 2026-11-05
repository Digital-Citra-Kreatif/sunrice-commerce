<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Sunrice\Admin\Actions\Permissions\SeedRoles;
use Sunrice\Commerce\Support\Staff;

/**
 * The store's roles, through the panel's default roles (SeedRoles, as
 * `sunrice:roles` does). Permissions are only ever added, and only those
 * not given before, so changes made to these roles in the admin are kept;
 * run again after adding attribute taxonomies (php artisan commerce:seed-roles).
 *
 * - Shop Manager (shop-manager, CommercePlugin's default role): the panel,
 *   media, the product collections and taxonomies, the inquiry form's
 *   submissions and every commerce permission.
 * - Customer: no admin permissions (the storefront role).
 * - The panel's administrator has every permission, commerce's included.
 */
class CommerceRolesSeeder extends Seeder
{
    public const SHOP_MANAGER = 'shop-manager';

    public const CUSTOMER = 'Customer';

    public function run(): void
    {
        app(SeedRoles::class)->handle();
        Role::findOrCreate(self::CUSTOMER, Staff::guard());
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
