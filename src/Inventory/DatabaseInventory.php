<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Models\BundleItem;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\PriceIndex;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Inventory\Events\StockBackIn;
use Sunrice\Commerce\Inventory\Events\StockChanged;
use Sunrice\Commerce\Inventory\Events\StockLow;
use Sunrice\Commerce\Inventory\Events\StockOut;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Stock in commerce_variants (ARCHITECTURE.md §7.6): reservations are
 * single conditional UPDATEs, so two checkouts can't sell the same last
 * unit; every change writes a movement and fires threshold events once
 * per crossing.
 */
class DatabaseInventory implements Inventory
{
    public function available(Variant $variant): int
    {
        if (! $variant->track_stock) {
            return $variant->stock_status === 'out_of_stock' ? 0 : PHP_INT_MAX;
        }

        return $variant->backorders === 'no' ? max(0, (int) $variant->stock_quantity) : PHP_INT_MAX;
    }

    public function reserve(array $lines, ?Model $reference = null, string $reason = 'order'): void
    {
        $changes = [];
        DB::transaction(function () use ($lines, $reference, $reason, &$changes): void {
            // In id order, so concurrent reservations lock rows in the same order.
            $quantities = $this->explode($lines);
            ksort($quantities);
            foreach ($quantities as $id => [$variant, $qty]) {
                if (! $variant->track_stock) {
                    if ($variant->stock_status === 'out_of_stock') {
                        throw new OutOfStock($variant, $qty, 0);
                    }

                    continue;
                }
                $affected = DB::table('commerce_variants')->where('id', $id)
                    ->where(fn ($q) => $q->where('track_stock', false)->orWhere('backorders', '!=', 'no')->orWhere('stock_quantity', '>=', $qty))
                    ->update(['stock_quantity' => DB::raw('COALESCE(stock_quantity, 0) - '.(int) $qty), 'updated_at' => now()]);
                if ($affected === 0) {
                    throw new OutOfStock($variant, $qty, max(0, (int) DB::table('commerce_variants')->where('id', $id)->value('stock_quantity')));
                }
                $changes[] = $this->record($variant, -$qty, $reason, $reference);
            }
        });
        $this->afterChanges($changes);
    }

    public function release(array $lines, ?Model $reference = null, string $reason = 'cancel'): void
    {
        $changes = [];
        DB::transaction(function () use ($lines, $reference, $reason, &$changes): void {
            foreach ($this->explode($lines) as $id => [$variant, $qty]) {
                if (! $variant->track_stock) {
                    continue;
                }
                DB::table('commerce_variants')->where('id', $id)->update(['stock_quantity' => DB::raw('COALESCE(stock_quantity, 0) + '.(int) $qty), 'updated_at' => now()]);
                $changes[] = $this->record($variant, $qty, $reason, $reference);
            }
        });
        $this->afterChanges($changes);
    }

    public function adjust(Variant $variant, int $quantity, bool $set = false, string $reason = 'manual', ?string $note = null, ?int $userId = null): Variant
    {
        $change = DB::transaction(function () use ($variant, $quantity, $set, $reason, $note, $userId) {
            $current = (int) DB::table('commerce_variants')->where('id', $variant->id)->lockForUpdate()->value('stock_quantity');
            $delta = $set ? $quantity - $current : $quantity;
            DB::table('commerce_variants')->where('id', $variant->id)->update([
                'stock_quantity' => DB::raw('COALESCE(stock_quantity, 0) + '.$delta), 'track_stock' => true, 'updated_at' => now(),
            ]);

            return $this->record($variant, $delta, $reason, null, $note, $userId);
        });
        $this->afterChanges([$change]);

        return $variant->refresh();
    }

    /**
     * Lines with bundles replaced by their components, summed per variant.
     *
     * @param  array<int, array{0: Variant, 1: int}>  $lines
     * @return array<int, array{0: Variant, 1: int}>
     */
    protected function explode(array $lines): array
    {
        $out = [];
        foreach ($lines as [$variant, $qty]) {
            $parts = $variant->product->isBundle()
                ? array_map(fn (array $c) => [$c['variant'], $c['quantity']], app(Bundles::class)->explode($variant->product, $qty))
                : [[$variant, $qty]];
            foreach ($parts as [$part, $partQty]) {
                $out[$part->id] = [$part, ($out[$part->id][1] ?? 0) + $partQty];
            }
        }

        return $out;
    }

    /** @return array{0: Variant, 1: int, 2: int} variant, before, after */
    protected function record(Variant $variant, int $delta, string $reason, ?Model $reference = null, ?string $note = null, ?int $userId = null): array
    {
        $after = (int) DB::table('commerce_variants')->where('id', $variant->id)->value('stock_quantity');
        StockMovement::query()->create([
            'variant_id' => $variant->id,
            'delta' => $delta,
            'quantity_after' => $after,
            'reason' => $reason,
            'reference_type' => $reference?->getMorphClass(),
            'reference_id' => $reference?->getKey(),
            'user_id' => $userId ?? auth(config('sunrice.auth.guard', 'web'))->id(),
            'note' => $note,
        ]);

        return [$variant, $after - $delta, $after];
    }

    /** @param  array<int, array{0: Variant, 1: int, 2: int}>  $changes */
    protected function afterChanges(array $changes): void
    {
        $products = [];
        foreach ($changes as [$variant, $before, $after]) {
            $variant->refresh();
            $status = $variant->computedStockStatus();
            if ($status !== $variant->stock_status) {
                $variant->forceFill(['stock_status' => $status])->saveQuietly();
            }
            StockChanged::dispatch($variant, $before, $after);
            $threshold = (int) ($variant->low_stock_threshold ?? app(StoreSettings::class)->get('catalog.low_stock_threshold', 5));
            if ($before > 0 && $after <= 0) {
                StockOut::dispatch($variant, $before, $after);
            } elseif ($before > $threshold && $after <= $threshold) {
                StockLow::dispatch($variant, $before, $after);
            }
            if ($before <= 0 && $after > 0) {
                StockBackIn::dispatch($variant, $before, $after);
            }
            $products[$variant->product_id] = $variant->product;
        }
        foreach ($products as $product) {
            app(PriceIndex::class)->refreshStock($product);
        }
        // Bundles made of these variants may have changed availability too.
        $bundleIds = BundleItem::query()->whereIn('variant_id', array_map(fn ($c) => $c[0]->id, $changes))->pluck('product_id')->unique();
        foreach (Product::query()->whereIn('id', $bundleIds)->get() as $bundle) {
            app(PriceIndex::class)->refreshStock($bundle);
        }
    }
}
