<?php

declare(strict_types=1);

use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Tests\TestCase;
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
