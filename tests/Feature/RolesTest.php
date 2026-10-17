<?php

declare(strict_types=1);

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Database\Seeders\CommerceRolesSeeder;
use Sunrice\Commerce\Permissions\CommercePermissions;
use Sunrice\Models\Blueprint;
use Sunrice\Models\Collection;
use Workbench\App\Models\User;

it('registers commerce permissions with Sunrice', function () {
    $this->artisan('sunrice:sync-permissions')->assertSuccessful();

    expect(Permission::query()->where('name', 'commerce.orders.refund')->exists())->toBeTrue()
        ->and(Permission::query()->where('name', 'like', 'commerce.%')->count())->toBe(count(CommercePermissions::all()));
});

it('seeds a Shop Manager who can open the admin and a Customer who can not', function () {
    $blueprint = Blueprint::create(['handle' => 'product', 'title' => 'Product', 'fields' => []]);
    $products = Collection::create(['handle' => 'products', 'title' => 'Products', 'blueprint_id' => $blueprint->id, 'settings' => []]);
    Role::findOrCreate('Administrator', 'web');

    $this->artisan('commerce:seed-roles')->assertSuccessful();
    $this->artisan('commerce:seed-roles')->assertSuccessful(); // only adds

    $manager = User::query()->create(['name' => 'M', 'email' => 'm@example.com', 'password' => 'x']);
    $manager->assignRole(CommerceRolesSeeder::SHOP_MANAGER);
    $customer = User::query()->create(['name' => 'C', 'email' => 'c@example.com', 'password' => 'x']);
    $customer->assignRole(CommerceRolesSeeder::CUSTOMER);

    expect($manager->can('sunrice.access-admin'))->toBeTrue()
        ->and($manager->can("sunrice.entries.{$products->id}.publish"))->toBeTrue()
        ->and($manager->can('commerce.orders.refund'))->toBeTrue()
        ->and($manager->can('sunrice.users.view'))->toBeFalse()
        ->and($customer->can('sunrice.access-admin'))->toBeFalse()
        ->and(Role::findByName('Administrator')->hasPermissionTo('commerce.settings.features'))->toBeTrue();

    $this->actingAs($manager)->get('/cms')->assertOk();
    $this->actingAs($customer)->get('/cms')->assertForbidden();
});
