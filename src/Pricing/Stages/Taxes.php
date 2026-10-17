<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Contracts\TaxCalculator;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

class Taxes implements CalculationStage
{
    public function __construct(protected TaxCalculator $taxes) {}

    public function run(CalculationState $state): void
    {
        $this->taxes->apply($state);
    }
}
