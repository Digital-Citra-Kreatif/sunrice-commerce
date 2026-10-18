<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Contracts;

use Sunrice\Commerce\Pricing\CalculationState;

/** Adds fees (payment method fees, the unique transfer code, extension fees). */
interface FeeProvider
{
    public function apply(CalculationState $state): void;
}
