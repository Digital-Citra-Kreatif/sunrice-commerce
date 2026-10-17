<?php

declare(strict_types=1);

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Sunrice\Commerce\Database\Seeders\DemoStoreSeeder as CommerceDemo;
use Sunrice\Commerce\Regions\RegionImporter;

/** The workbench store: the fixture regions (small and fast), then commerce's demo store. */
class DemoStoreSeeder extends Seeder
{
    public function run(): void
    {
        (new RegionImporter(__DIR__.'/../../../tests/Fixtures/regions'))->import(4);
        app(CommerceDemo::class)->run();
    }
}
