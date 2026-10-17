<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support\Nulls;

use Illuminate\Database\Eloquent\Model;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Inventory\OutOfStock;

/** Stock tracking off: only the manual stock status counts. */
class NullInventory implements Inventory
{
    public function available(Variant $variant): int
    {
        return $variant->stock_status === 'out_of_stock' ? 0 : PHP_INT_MAX;
    }

    public function reserve(array $lines, ?Model $reference = null, string $reason = 'order'): void
    {
        foreach ($lines as [$variant, $qty]) {
            if ($this->available($variant) < $qty) {
                throw new OutOfStock($variant, $qty, 0);
            }
        }
    }

    public function release(array $lines, ?Model $reference = null, string $reason = 'cancel'): void {}

    public function adjust(Variant $variant, int $quantity, bool $set = false, string $reason = 'manual', ?string $note = null, ?int $userId = null): Variant
    {
        return $variant;
    }
}
