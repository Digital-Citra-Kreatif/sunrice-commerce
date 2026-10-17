<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Commerce\Regions\RegionImporter;

/** commerce:regions:import — loads Indonesian provinces, cities, districts and villages. */
class ImportRegionsCommand extends Command
{
    protected $signature = 'commerce:regions:import
        {--level=district : How deep: province, city, district or village}';

    protected $description = 'Import Indonesian regions (Kemendagri codes) for addresses and shipping zones';

    public function handle(RegionImporter $importer): int
    {
        $level = Region::LEVELS[(string) $this->option('level')] ?? null;
        if ($level === null) {
            $this->components->error('Choose a level: province, city, district or village.');

            return self::FAILURE;
        }

        $counts = $importer->import($level);
        $labels = [1 => 'provinces', 2 => 'cities/regencies', 3 => 'districts', 4 => 'villages'];
        foreach ($counts as $l => $count) {
            $this->components->twoColumnDetail(ucfirst($labels[$l]), number_format($count));
        }
        $this->components->info('Regions imported ('.RegionImporter::DATASET.').');

        return self::SUCCESS;
    }
}
