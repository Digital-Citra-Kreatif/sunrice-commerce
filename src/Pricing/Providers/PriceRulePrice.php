<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Providers;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\PriceCandidateProvider;
use Sunrice\Commerce\Pricing\PriceCandidate;
use Sunrice\Commerce\Promotions\PriceRules\PriceRule;
use Sunrice\Commerce\Promotions\PriceRules\RuleMatcher;
use Sunrice\Commerce\Promotions\Tiers;

/**
 * Pricing rules: the tier each matching rule gives for the counted
 * quantity (the line, the product's lines or every line the rule targets),
 * the best across rules.
 */
class PriceRulePrice implements PriceCandidateProvider
{
    public function __construct(protected Features $features, protected RuleMatcher $matcher) {}

    public function candidates(CalcLine $line, CalculationState $state): iterable
    {
        if (! $this->features->active('pricing_rules')) {
            return;
        }
        $this->matcher->preload(array_map(fn (CalcLine $l) => (int) $l->product()->entry_id, array_values($state->lines)));
        $best = null;
        foreach ($this->matcher->for($line->variant, $state->ctx) as $rule) {
            $qty = $this->countedQuantity($rule, $line, $state);
            $tier = Tiers::best($rule->tiers, $qty, $line->variant->price);
            if ($tier !== null && ($best === null || $tier['price'] < $best[1]['price'])) {
                $best = [$rule, $tier];
            }
        }
        if ($best !== null) {
            yield new PriceCandidate($best[1]['price'], ['type' => 'price_rule', 'id' => $best[0]->id, 'label' => $best[0]->name], ['min_qty' => $best[1]['min_qty']]);
        }
    }

    protected function countedQuantity(PriceRule $rule, CalcLine $line, CalculationState $state): int
    {
        return match ($rule->quantity_basis) {
            'product' => array_sum(array_map(fn (CalcLine $l) => $l->variant->product_id === $line->variant->product_id ? $l->quantity : 0, $state->lines)),
            'rule' => array_sum(array_map(fn (CalcLine $l) => $this->matcher->targets($rule, $l->variant) ? $l->quantity : 0, $state->lines)),
            default => $line->quantity,
        };
    }
}
