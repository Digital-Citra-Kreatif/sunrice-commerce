<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Facades\DB;

/**
 * Which product entries bundle components belong to, for the Product data
 * field's references (the CMS asks every entry's fields for them while it
 * hydrates a page of entries). The components of every bundle in the
 * store load once per request, in one query; a component not among them
 * yet (a bundle being edited) is looked up on its own. Per request
 * (scoped), so it never goes stale.
 */
final class BundleComponents
{
    /** @var array<int, int>|null variant id => entry id */
    private ?array $entries = null;

    /**
     * @param  list<int>  $variantIds
     * @return list<int> the entries those variants belong to
     */
    public function entryIds(array $variantIds): array
    {
        $this->entries ??= $this->load(DB::table('commerce_bundle_items')->select('variant_id'));
        $missing = array_values(array_diff($variantIds, array_keys($this->entries)));
        if ($missing !== []) {
            $this->entries += $this->load($missing);
        }

        return array_values(array_unique(array_filter(array_map(fn (int $id): ?int => $this->entries[$id] ?? null, $variantIds))));
    }

    /**
     * @param  \Illuminate\Database\Query\Builder|list<int>  $variants
     * @return array<int, int>
     */
    private function load(\Illuminate\Database\Query\Builder|array $variants): array
    {
        return DB::table('commerce_variants')->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
            ->whereIn('commerce_variants.id', $variants)->pluck('commerce_products.entry_id', 'commerce_variants.id')
            ->mapWithKeys(fn (mixed $entry, mixed $variant): array => [(int) $variant => (int) $entry])->all();
    }
}
