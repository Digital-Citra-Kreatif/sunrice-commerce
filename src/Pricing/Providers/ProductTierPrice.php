<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Providers;

use Sunrice\Commerce\Catalog\Models\PriceTier;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\PriceCandidateProvider;
use Sunrice\Commerce\Pricing\PriceCandidate;
use Sunrice\Commerce\Promotions\Tiers;

/**
 * A product's own bulk tiers (product data → Bulk prices). Tiers for all
 * variants count the product's lines together; a variant's own tiers
 * count that variant.
 */
class ProductTierPrice implements PriceCandidateProvider
{
    public function __construct(protected Features $features) {}

    public function candidates(CalcLine $line, CalculationState $state): iterable
    {
        if (! $this->features->active('pricing_rules')) {
            return;
        }
        $product = $line->product();
        $tiers = $product->relationLoaded('tiers') ? $product->tiers : $product->tiers()->get();
        if ($tiers->isEmpty()) {
            return;
        }
        $productQty = 0;
        foreach ($state->lines as $other) {
            if ($other->variant->product_id === $product->id) {
                $productQty += $other->quantity;
            }
        }
        $applicable = $tiers->filter(fn (PriceTier $t) => $t->variant_id === null || $t->variant_id === $line->variant->id)
            ->map(fn (PriceTier $t) => ['min_qty' => $t->variant_id === null ? $t->min_qty : $t->min_qty, 'type' => $t->type, 'value' => $t->value, 'variant' => $t->variant_id])
            ->all();
        $best = null;
        foreach ($applicable as $tier) {
            $qty = $tier['variant'] === null ? $productQty : $line->quantity;
            $found = Tiers::best([$tier], $qty, $line->variant->price);
            if ($found !== null && ($best === null || $found['price'] < $best['price'])) {
                $best = $found;
            }
        }
        if ($best !== null) {
            yield new PriceCandidate($best['price'], ['type' => 'tier', 'id' => $product->id, 'label' => (string) $best['min_qty']], ['min_qty' => $best['min_qty']]);
        }
    }
}
