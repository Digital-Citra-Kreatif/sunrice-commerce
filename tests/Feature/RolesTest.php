<?php

declare(strict_types=1);

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Database\Seeders\CommerceRolesSeeder;
use Sunrice\Commerce\Permissions\CommercePermissions;
use Sunrice\Cms\Models\Blueprint;
use Sunrice\Cms\Models\Collection;
use Workbench\App\Models\User;

it('registers commerce permissions with the panel', function () {
    app(\Sunrice\Admin\Actions\Permissions\SyncPermissions::class)->handle();

    expect(Permission::query()->where('name', 'commerce.orders.refund')->exists())->toBeTrue()
        ->and(Permission::query()->where('name', 'like', 'commerce.%')->count())->toBe(count(CommercePermissions::all()));
});

it('seeds a Shop Manager who can open the admin and a Customer who can not', function () {
    Blueprint::create(['handle' => 'product', 'title' => 'Product', 'fields' => []]);
    Collection::create(['handle' => 'products', 'title' => 'Products', 'blueprint' => 'product']);

    $this->artisan('commerce:seed-roles')->assertSuccessful();
    $this->artisan('commerce:seed-roles')->assertSuccessful(); // only adds

    $manager = User::query()->create(['name' => 'M', 'email' => 'm@example.com', 'password' => 'x']);
    $manager->assignRole(CommerceRolesSeeder::SHOP_MANAGER);
    $customer = User::query()->create(['name' => 'C', 'email' => 'c@example.com', 'password' => 'x']);
    $customer->assignRole(CommerceRolesSeeder::CUSTOMER);

    expect($manager->can('sunrice.access'))->toBeTrue()
        ->and($manager->can('cms.entries.products.publish'))->toBeTrue()
        ->and($manager->can('commerce.orders.refund'))->toBeTrue()
        ->and($manager->can('sunrice.users.view'))->toBeFalse()
        ->and($customer->can('sunrice.access'))->toBeFalse()
        ->and(Role::findByName('administrator')->hasPermissionTo('commerce.settings.features'))->toBeTrue();

    $this->actingAs($manager)->get('/admin')->assertOk();
    $this->actingAs($customer)->get('/admin')->assertForbidden();
});
