<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Contracts;

use Sunrice\Commerce\Catalog\Models\Variant;

/** Quantity caps of active sales (flash sales): how many more units this customer may buy. */
interface SaleLimits
{
    public function remaining(Variant $variant, mixed $customer = null): ?int;
}
