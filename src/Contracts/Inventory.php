<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Contracts;

use Illuminate\Database\Eloquent\Model;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Inventory\OutOfStock;

/**
 * Stock of variants. DatabaseInventory when the inventory module is on;
 * otherwise (NullInventory) nothing is counted and everything not marked
 * out of stock can be sold.
 */
interface Inventory
{
    /** How many units can be sold now (PHP_INT_MAX when unlimited). */
    public function available(Variant $variant): int;

    /**
     * Take stock for lines, all or nothing (bundles take their components).
     *
     * @param  array<int, array{0: Variant, 1: int}>  $lines
     *
     * @throws OutOfStock
     */
    public function reserve(array $lines, ?Model $reference = null, string $reason = 'order'): void;

    /**
     * Give stock back (a cancelled or expired order, a refund).
     *
     * @param  array<int, array{0: Variant, 1: int}>  $lines
     */
    public function release(array $lines, ?Model $reference = null, string $reason = 'cancel'): void;

    /** A manual change: by $delta, or to $quantity when $set. */
    public function adjust(Variant $variant, int $quantity, bool $set = false, string $reason = 'manual', ?string $note = null, ?int $userId = null): Variant;
}
