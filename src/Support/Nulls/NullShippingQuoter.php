<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support\Nulls;

use Sunrice\Commerce\Contracts\ShippingQuoter;
use Sunrice\Commerce\Pricing\CalculationState;

class NullShippingQuoter implements ShippingQuoter
{
    public function rates(CalculationState $state): array
    {
        return [];
    }
}
