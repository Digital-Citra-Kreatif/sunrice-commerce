<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Pricing\PriceProviders;

class Fees implements CalculationStage
{
    public function __construct(protected PriceProviders $providers) {}

    public function run(CalculationState $state): void
    {
        if ($state->isEmpty()) {
            return;
        }
        foreach ($this->providers->fees() as $provider) {
            $provider->apply($state);
        }
    }
}
