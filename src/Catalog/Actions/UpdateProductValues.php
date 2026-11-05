<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Actions;

use Closure;
use Sunrice\Cms\Models\Entry;
use Sunrice\Commerce\Catalog\ProductProjector;
use Sunrice\Commerce\Catalog\ProductValue;

/**
 * Changes the product field of entries outside the editor (bulk actions,
 * MCP): in the live value and in a pending draft alike, then re-projects
 * published entries. The value stays the single source of truth.
 */
class UpdateProductValues
{
    public function __construct(protected ProductProjector $projector) {}

    /**
     * @param  Closure(array<string, mixed>): array<string, mixed>  $change  receives and returns a normalized value
     */
    public function handle(Entry $entry, Closure $change): void
    {
        $translation = $entry->mainTranslation();
        if ($translation === null) {
            return;
        }
        $field = (string) config('commerce.catalog.field', 'product');

        // The live value (when published) and the draft's, so the next publish keeps the change.
        if ($translation->data !== null) {
            $data = (array) $translation->data;
            $data[$field] = $change(ProductValue::withIds(ProductValue::normalize($data[$field] ?? null)));
            $translation->data = $data;
        }
        $draft = (array) ($translation->draft_data ?? []);
        $draft[$field] = $change(ProductValue::withIds(ProductValue::normalize($draft[$field] ?? null)));
        $translation->draft_data = $draft;
        $translation->save();

        if ($translation->isPublished()) {
            $this->projector->sync($entry->fresh() ?? $entry);
        }
    }
}
