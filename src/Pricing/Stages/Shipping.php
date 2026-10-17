<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Contracts\ShippingQuoter;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/** Rates for the destination when a line needs shipping; the chosen rate's cost. */
class Shipping implements CalculationStage
{
    public function __construct(protected ShippingQuoter $quoter) {}

    public function run(CalculationState $state): void
    {
        $state->shipping = ['needed' => $state->needsShipping(), 'rates' => [], 'rate' => null, 'cost' => 0];
        if (! $state->shipping['needed'] || $state->ctx->destination === null) {
            return;
        }
        $rates = $this->quoter->rates($state);
        $state->shipping['rates'] = $rates;
        foreach ($rates as $rate) {
            if ($rate['id'] === $state->ctx->shippingRate) {
                $state->shipping['rate'] = $rate;
                $state->shipping['cost'] = max(0, (int) $rate['cost']);
            }
        }
    }
}
