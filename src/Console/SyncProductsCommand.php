<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Console;

use Illuminate\Console\Command;
use Sunrice\Commerce\Catalog\ProductProjector;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;

/** commerce:sync-products — re-project published product entries (all, or --entry=ID…). */
class SyncProductsCommand extends Command
{
    protected $signature = 'commerce:sync-products {--entry=* : Only these entry ids} {--force : Even when unchanged}';

    protected $description = 'Project product entries into the commerce tables';

    public function handle(ProductProjector $projector): int
    {
        $collections = Collection::query()->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->pluck('id');
        $ids = array_map('intval', (array) $this->option('entry'));
        $failed = 0;
        $count = 0;

        Entry::query()->whereIn('collection_id', $collections)->whereNotNull('published_at')
            ->when($ids !== [], fn ($q) => $q->whereIn('id', $ids))
            ->with('translations')
            ->chunkById(100, function ($entries) use ($projector, &$failed, &$count): void {
                foreach ($entries as $entry) {
                    $product = $projector->sync($entry, (bool) $this->option('force'));
                    $count++;
                    if ($product->syncFailed()) {
                        $failed++;
                        $this->components->error("Entry {$entry->id}: {$product->sync_error}");
                    }
                }
            });

        $this->components->info("Synced {$count} products".($failed > 0 ? ", {$failed} failed." : '.'));

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
