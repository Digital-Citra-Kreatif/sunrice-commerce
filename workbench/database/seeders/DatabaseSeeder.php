<?php

declare(strict_types=1);

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Workbench\App\Models\User;

/** The workbench store: a super admin (admin@example.com / password) and a demo store. */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => bcrypt('password')],
        );
        $admin->assignRole(Role::findOrCreate((string) config('sunrice.super_admin_role'), (string) config('sunrice.auth.guard', 'web')));
        $this->call(DemoStoreSeeder::class);
    }
}
