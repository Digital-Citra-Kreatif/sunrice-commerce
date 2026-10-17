<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

class Subtotals implements CalculationStage
{
    public function run(CalculationState $state): void
    {
        foreach ($state->lines as $line) {
            $line->subtotal = $line->unitPrice * $line->quantity;
        }
    }
}
