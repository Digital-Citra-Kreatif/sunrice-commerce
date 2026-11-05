<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Cms\Structure\ImportReport;
use Sunrice\Cms\Structure\StructureImportFailed;
use Sunrice\Commerce\Catalog\Actions\ScaffoldStore;

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
            $detail = $item['status'].($item['notes'] !== [] ? ' ('.implode(' ', $item['notes']).')' : '');
            $this->components->twoColumnDetail("{$item['type']} {$item['handle']}", $detail);
        }
        $written = array_filter($report->items(), fn (array $item): bool => in_array($item['status'], [ImportReport::CREATED, ImportReport::UPDATED], true));
        if ($written === []) {
            $this->components->info('The store structure is complete: nothing to do.');
        } elseif (! $report->dryRun && $report->items(ScaffoldStore::KEPT) !== []) {
            $this->components->warn('What exists was kept as it is. Run with --force to replace it with the store\'s defaults.');
        }

        return self::SUCCESS;
    }
}
