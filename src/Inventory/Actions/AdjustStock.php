<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Inventory\Actions;

use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Support\ActivityRecorder;

/** A manual stock change by staff (or an import): recorded as a movement and in the activity log. */
class AdjustStock
{
    public const REASONS = ['manual', 'correction', 'import', 'refund'];

    public function __construct(protected Inventory $inventory) {}

    public function handle(Variant $variant, int $quantity, bool $set = false, string $reason = 'manual', ?string $note = null, ?int $userId = null): Variant
    {
        if (! in_array($reason, self::REASONS, true)) {
            throw ValidationException::withMessages(['reason' => 'Choose a reason.']);
        }
        // Tracking is part of the product's data (the entry): switching it on here would be undone by the next save.
        if (! $variant->track_stock) {
            throw ValidationException::withMessages(['quantity' => 'Stock isn\'t tracked for this variant: switch on "Track stock" in the product first.']);
        }
        if ($set && $quantity < 0) {
            throw ValidationException::withMessages(['quantity' => 'Stock can\'t be set below 0.']);
        }
        $before = (int) $variant->stock_quantity;
        $variant = $this->inventory->adjust($variant, $quantity, $set, $reason, $note, $userId);

        app(ActivityRecorder::class)->record('adjusted', 'Stock: '.($variant->sku ?: "variant {$variant->id}"),
            ['changes' => ['stock_quantity'], 'note' => "{$before} → {$variant->stock_quantity}".($note ? " ({$note})" : '')], 'stock');

        return $variant;
    }
}
