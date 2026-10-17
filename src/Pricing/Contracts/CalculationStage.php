<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Contracts;

use Sunrice\Commerce\Pricing\CalculationState;

/** A step of the calculation pipeline (registered with a priority; lower runs first). */
interface CalculationStage
{
    public function run(CalculationState $state): void;
}
