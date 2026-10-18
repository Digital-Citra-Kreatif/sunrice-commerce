<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Pricing\PriceProviders;

class ShippingDiscounts implements CalculationStage
{
    public function __construct(protected PriceProviders $providers) {}

    public function run(CalculationState $state): void
    {
        if (! $state->shipping['needed']) {
            return;
        }
        foreach ($this->providers->shippingDiscounts() as $provider) {
            $provider->apply($state);
        }
    }
}
