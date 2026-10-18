<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support\Nulls;

use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\SaleLimits;

class NullSaleLimits implements SaleLimits
{
    public function remaining(Variant $variant, mixed $customer = null): ?int
    {
        return null;
    }
}
