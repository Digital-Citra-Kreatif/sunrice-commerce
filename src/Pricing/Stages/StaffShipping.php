<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/** Shipping staff set by hand (a label and a cost), replacing quoted rates. */
class StaffShipping implements CalculationStage
{
    public function run(CalculationState $state): void
    {
        $shipping = $state->ctx->overrides['shipping'] ?? null;
        if (! $state->ctx->isStaff() || $shipping === null || ! $state->shipping['needed']) {
            return;
        }
        $rate = ['id' => 'manual:0:manual', 'method' => 'manual', 'method_id' => 0, 'service' => 'manual', 'label' => (string) $shipping['label'],
            'cost' => max(0, (int) $shipping['cost']), 'eta' => null, 'meta' => []];
        $state->shipping['rate'] = $rate;
        $state->shipping['cost'] = $rate['cost'];
    }
}
