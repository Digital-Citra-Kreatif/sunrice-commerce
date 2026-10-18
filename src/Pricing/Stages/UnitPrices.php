<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Pricing\PriceCandidate;
use Sunrice\Commerce\Pricing\PriceProviders;

/** The lowest candidate price wins (ties keep the earlier provider). */
class UnitPrices implements CalculationStage
{
    public function __construct(protected PriceProviders $providers) {}

    public function run(CalculationState $state): void
    {
        foreach ($state->lines as $line) {
            /** @var PriceCandidate|null $best */
            $best = null;
            $base = null;
            foreach ($this->providers->all() as $provider) {
                foreach ($provider->candidates($line, $state) as $candidate) {
                    $base ??= $candidate;
                    if ($best === null || $candidate->amount < $best->amount) {
                        $best = $candidate;
                    }
                }
            }
            if ($best === null) {
                continue;
            }
            $regular = max($base->amount ?? $best->amount, (int) $line->variant->compare_at_price);
            $line->unitPrice = max(0, $best->amount);
            $line->regularUnitPrice = max($regular, $line->unitPrice);
            $line->priceSource = $best->source;
            $line->priceMeta = $best->meta;
            $line->onSale = $best->source['type'] === 'flash_sale' || $line->unitPrice < (int) $line->variant->compare_at_price;
        }
    }
}
