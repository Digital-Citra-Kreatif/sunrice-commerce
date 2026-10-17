<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Actions;

use Closure;
use Sunrice\Commerce\Catalog\ProductProjector;
use Sunrice\Commerce\Catalog\ProductValue;
use Sunrice\Models\Entry;

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

        $data = (array) ($translation->data ?? []);
        if (array_key_exists($field, $data) || $translation->draft === null) {
            $data[$field] = $change(ProductValue::withIds(ProductValue::normalize($data[$field] ?? null)));
            $translation->data = $data;
        }
        if (is_array($translation->draft)) {
            $draft = $translation->draft;
            $draftData = (array) ($draft['data'] ?? []);
            $draftData[$field] = $change(ProductValue::withIds(ProductValue::normalize($draftData[$field] ?? null)));
            $draft['data'] = $draftData;
            $translation->draft = $draft;
        }
        $translation->save();

        if ($entry->published_at !== null) {
            $this->projector->sync($entry->fresh() ?? $entry);
        }
    }
}
