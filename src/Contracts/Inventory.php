<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Contracts;

use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * Stock of variants. DatabaseInventory when the inventory module is on;
 * otherwise nothing is counted and everything not marked out of stock
 * can be sold.
 */
interface Inventory
{
    /** How many units can be sold now (PHP_INT_MAX when unlimited). */
    public function available(Variant $variant): int;
}
