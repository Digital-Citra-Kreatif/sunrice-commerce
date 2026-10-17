<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support\Nulls;

use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;

/** Stock tracking off: only the manual stock status counts. */
class NullInventory implements Inventory
{
    public function available(Variant $variant): int
    {
        return $variant->stock_status === 'out_of_stock' ? 0 : PHP_INT_MAX;
    }
}
