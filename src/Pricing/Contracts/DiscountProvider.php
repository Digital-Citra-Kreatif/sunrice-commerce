<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Contracts;

use Sunrice\Commerce\Pricing\CalculationState;

/** Adds discount adjustments (with per-line allocations) to a calculation, in priority order. */
interface DiscountProvider
{
    public function priority(): int;

    public function apply(CalculationState $state): void;
}
