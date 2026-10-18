<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments;

/** A payment method's surcharge. */
final class Fee
{
    public function __construct(public readonly int $amount, public readonly string $label) {}
}
