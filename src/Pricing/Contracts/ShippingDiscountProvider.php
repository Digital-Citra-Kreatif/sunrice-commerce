<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Contracts;

use Sunrice\Commerce\Pricing\CalculationState;

/** Takes something off the shipping cost (free-shipping vouchers…), after the rate is known. */
interface ShippingDiscountProvider
{
    public function apply(CalculationState $state): void;
}
