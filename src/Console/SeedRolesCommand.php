<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Commerce\Database\Seeders\CommerceRolesSeeder;

/** commerce:seed-roles — creates the Shop Manager and Customer roles, or adds new permissions to them. */
class SeedRolesCommand extends Command
{
    protected $signature = 'commerce:seed-roles';

    protected $description = 'Create the Shop Manager and Customer roles (or add new permissions to them)';

    public function handle(): int
    {
        $this->call('db:seed', ['--class' => CommerceRolesSeeder::class, '--force' => true]);
        $this->components->info('Store roles are up to date.');

        return self::SUCCESS;
    }
}
