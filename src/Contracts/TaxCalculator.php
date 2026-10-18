<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Contracts;

use Sunrice\Commerce\Pricing\CalculationState;

/** Taxes of a calculation's lines and shipping (TableRateTaxCalculator when taxes are on). */
interface TaxCalculator
{
    public function apply(CalculationState $state): void;
}
