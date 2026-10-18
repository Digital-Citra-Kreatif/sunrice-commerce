<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Models\Term;

/**
 * Whether a variant is among targets (products, variants, terms with
 * their descendants). Entry terms are loaded once per request.
 */
class TargetMatcher
{
    /** @var array<int, array<int, int>> entry id => term ids */
    protected array $entryTerms = [];

    /** @var array<string, array<int, int>> */
    protected array $expanded = [];

    /** @param  iterable<array{type: string, id: int}|object>  $targets */
    public function matches(iterable $targets, Variant $variant): bool
    {
        $terms = [];
        foreach ($targets as $target) {
            $type = is_array($target) ? $target['type'] : $target->target_type;
            $id = (int) (is_array($target) ? $target['id'] : $target->target_id);
            if (($type === 'product' && $id === $variant->product_id) || ($type === 'variant' && $id === $variant->id)) {
                return true;
            }
            if ($type === 'term') {
                $terms[] = $id;
            }
        }
        if ($terms === []) {
            return false;
        }

        return array_intersect($this->expand($terms), $this->termsOf((int) $variant->product->entry_id)) !== [];
    }

    /** @param  array<int, int>  $entryIds */
    public function preload(array $entryIds): void
    {
        $missing = array_values(array_diff($entryIds, array_keys($this->entryTerms)));
        foreach ($missing as $id) {
            $this->entryTerms[$id] = [];
        }
        if ($missing !== []) {
            foreach (DB::table('sunrice_entry_term')->whereIn('entry_id', $missing)->get(['entry_id', 'term_id']) as $row) {
                $this->entryTerms[(int) $row->entry_id][] = (int) $row->term_id;
            }
        }
    }

    /** @return array<int, int> */
    protected function termsOf(int $entryId): array
    {
        $this->preload([$entryId]);

        return $this->entryTerms[$entryId];
    }

    /**
     * @param  array<int, int>  $ids
     * @return array<int, int>
     */
    protected function expand(array $ids): array
    {
        sort($ids);

        return $this->expanded[implode(',', $ids)] ??= (function () use ($ids): array {
            $all = $ids;
            foreach (Term::query()->whereIn('id', $ids)->get() as $term) {
                $all = [...$all, ...$term->descendantIds()];
            }

            return array_values(array_unique(array_map('intval', $all)));
        })();
    }
}
