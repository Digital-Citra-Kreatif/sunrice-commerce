<?php

declare(strict_types=1);

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Sunrice\Commerce\Database\Seeders\StarterStoreSeeder;
use Sunrice\Commerce\Regions\RegionImporter;

/** The workbench store: Indonesian regions down to districts, then commerce's starter store. */
class DemoStoreSeeder extends Seeder
{
    public function run(): void
    {
        (new RegionImporter)->import(3);
        app(StarterStoreSeeder::class)->run();
    }
}
