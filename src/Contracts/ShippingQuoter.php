<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Contracts;

use Sunrice\Commerce\Pricing\CalculationState;

/** Shipping rates for a calculation's destination and parcels (ShippingManager when shipping is on). */
interface ShippingQuoter
{
    /** @return array<int, array{id: string, method: string, label: string, cost: int, eta?: string|null, meta?: array<string, mixed>}> */
    public function rates(CalculationState $state): array;
}
