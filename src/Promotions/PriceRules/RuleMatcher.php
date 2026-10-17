<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\PriceRules;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\CatalogVersion;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Models\Term;

/**
 * Which pricing rules apply to a variant for a customer (ARCHITECTURE.md
 * §9.1): active, inside its dates, audience and target. Category targets
 * include their descendant terms.
 */
class RuleMatcher
{
    /** @var Collection<int, PriceRule>|null */
    protected ?Collection $rules = null;

    /** @var array<int, array<int, int>> entry id => term ids */
    protected array $entryTerms = [];

    /** @return Collection<int, PriceRule> rules active now, with targets */
    public function active(PricingContext $ctx): Collection
    {
        $now = $ctx->now();
        $this->rules ??= PriceRule::query()->with('targets')->where('active', true)->orderByDesc('priority')->get();

        return $this->rules->filter(fn (PriceRule $r) => ($r->starts_at === null || $r->starts_at <= $now) && ($r->ends_at === null || $r->ends_at > $now)
            && $this->audienceMatches($r, $ctx))->values();
    }

    public function audienceMatches(PriceRule $rule, PricingContext $ctx): bool
    {
        return match ($rule->audience) {
            'guests' => $ctx->isGuest(),
            'signed_in' => ! $ctx->isGuest(),
            'roles' => array_intersect((array) $rule->roles, $ctx->roles) !== [],
            default => true,
        };
    }

    public function targets(PriceRule $rule, Variant $variant): bool
    {
        if ($rule->scope === 'all') {
            return true;
        }
        $ids = $rule->targets->pluck('target_id')->all();

        return match ($rule->scope) {
            'products' => in_array($variant->product_id, $ids, true),
            'variants' => in_array($variant->id, $ids, true),
            'categories', 'brands' => array_intersect($this->expandedTerms($rule), $this->termsOf((int) $variant->product->entry_id)) !== [],
            default => false,
        };
    }

    /** @return Collection<int, PriceRule> */
    public function for(Variant $variant, PricingContext $ctx): Collection
    {
        return $this->active($ctx)->filter(fn (PriceRule $r) => $this->targets($r, $variant))->values();
    }

    /** @param  array<int, int>  $entryIds  preload the terms of these entries */
    public function preload(array $entryIds): void
    {
        $missing = array_diff($entryIds, array_keys($this->entryTerms));
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

    /** @return array<int, int> the rule's terms with their descendants (cached per catalog version) */
    protected function expandedTerms(PriceRule $rule): array
    {
        $ids = $rule->targets->where('target_type', 'term')->pluck('target_id')->map(fn ($id) => (int) $id)->all();

        return CatalogVersion::remember('rule-terms:'.$rule->id.':'.$rule->updated_at?->getTimestamp(), 300, function () use ($ids) {
            $all = $ids;
            foreach (Term::query()->whereIn('id', $ids)->get() as $term) {
                $all = [...$all, ...$term->descendantIds()];
            }

            return array_values(array_unique(array_map('intval', $all)));
        });
    }
}
