<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support\Nulls;

use Sunrice\Commerce\Contracts\TaxCalculator;
use Sunrice\Commerce\Pricing\CalculationState;

/** Taxes off: no tax anywhere. */
class NullTaxCalculator implements TaxCalculator
{
    public function apply(CalculationState $state): void {}
}
