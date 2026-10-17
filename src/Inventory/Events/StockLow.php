<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Inventory\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Catalog\Models\Variant;

/** Stock fell to or below the low-stock threshold. */
class StockLow
{
    use Dispatchable;

    public function __construct(public readonly Variant $variant, public readonly ?int $before = null, public readonly ?int $after = null) {}
}
