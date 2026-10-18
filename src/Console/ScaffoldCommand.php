<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;
use Sunrice\Structure\ImportReport;
use Sunrice\Structure\StructureImportFailed;

/** commerce:scaffold — create the store's collection, blueprints, taxonomies, form, pages and menu. */
class ScaffoldCommand extends Command
{
    protected $signature = 'commerce:scaffold {--dry-run : Report without saving} {--force : Overwrite items changed in the admin}';

    protected $description = 'Create the store structure in Sunrice (products, categories, brands, inquiry form…)';

    public function handle(ScaffoldStore $scaffold): int
    {
        try {
            $report = $scaffold->handle((bool) $this->option('dry-run'), (bool) $this->option('force'));
        } catch (StructureImportFailed $e) {
            $this->components->error($e->getMessage());

            return self::FAILURE;
        }

        foreach ($report->items() as $item) {
            if ($item['status'] === ImportReport::UNCHANGED) {
                continue;
            }
            $detail = $item['status'].($item['differences'] !== [] ? ' ('.implode(', ', $item['differences']).')' : '');
            $this->components->twoColumnDetail("{$item['type']} {$item['handle']}", $detail);
        }
        if (! $report->wroteAnything() && $report->items(ImportReport::CHANGED) === []) {
            $this->components->info('The store structure is complete: nothing to do.');
        }
        if ($report->items(ImportReport::CHANGED) !== []) {
            $this->components->warn('Some items were changed in the admin and were kept. Run with --force to overwrite them.');
        }

        return self::SUCCESS;
    }
}
