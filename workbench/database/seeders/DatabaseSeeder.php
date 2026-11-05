<?php

declare(strict_types=1);

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Support\Staff;
use Workbench\App\Models\User;

/** The workbench store: a super admin (admin@example.com / Sunrice-Demo-2026!) and the starter store (customer@example.com / password). */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => bcrypt('Sunrice-Demo-2026!')],
        );
        $admin->assignRole(Role::findOrCreate(Staff::superAdminRole(), Staff::guard()));
        $this->call(DemoStoreSeeder::class);
    }
}
