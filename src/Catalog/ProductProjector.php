<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Events\ProductSynced;
use Sunrice\Commerce\Catalog\Events\ProductSyncFailed;
use Sunrice\Commerce\Catalog\Models\BundleItem;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Catalog\Models\PriceTier;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\ProductOption;
use Sunrice\Commerce\Catalog\Models\ProductOptionValue;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Models\Entry;
use Sunrice\Models\Scopes\HiddenWithParent;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Throwable;

/**
 * Projects a product entry's published `product` value into the commerce
 * tables (ARCHITECTURE.md §7.2). Rows are updated in place, so ids stay
 * stable for carts and orders; stock is only ever set once (initial_stock).
 */
class ProductProjector
{
    /** Whether the entry belongs to a product collection. */
    public static function isProduct(Entry $entry): bool
    {
        $handle = $entry->relationLoaded('collection') ? $entry->collection?->handle : $entry->collection()->value('handle');

        return in_array($handle, (array) config('commerce.catalog.collections', ['products']), true);
    }

    /** The live (published) value of the entry's product field. */
    public static function liveValue(Entry $entry): mixed
    {
        $data = (array) ($entry->mainTranslation()->data ?? []);

        return $data[(string) config('commerce.catalog.field', 'product')] ?? null;
    }

    /**
     * Project the entry. Never throws: a failure is recorded on the product
     * (sync_status = failed) and reported.
     */
    public function sync(Entry $entry, bool $force = false): Product
    {
        $value = ProductValue::withIds(ProductValue::normalize(static::liveValue($entry)));
        $product = Product::query()->firstOrNew(['entry_id' => $entry->id]);
        $hash = hash('sha256', (string) json_encode($value));
        if (! $force && $product->exists && $product->data_hash === $hash && $product->sync_status === 'ok' && $product->removed_at === null) {
            return $product;
        }

        try {
            $errors = ProductValue::errors($value, $product->exists ? $product->id : null);
            if ($errors !== []) {
                throw new InvalidProductValue(implode(' ', array_map(fn ($path, $message) => "{$path}: {$message}", array_keys($errors), $errors)));
            }
            DB::transaction(function () use ($entry, $value, $product, $hash): void {
                $this->write($entry, $value, $product, $hash);
            });
        } catch (Throwable $e) {
            if (! $e instanceof InvalidProductValue) {
                report($e);
            }
            $product->forceFill([
                'collection_id' => $entry->collection_id,
                'type' => $product->exists ? $product->type : $value['type'],
                'sync_status' => 'failed',
                'sync_error' => mb_substr($e->getMessage(), 0, 2000),
                'synced_at' => now(),
            ])->save();
            ProductSyncFailed::dispatch($product, $product->sync_error);

            return $product;
        }

        ProductSynced::dispatch($product);

        return $product;
    }

    /** @param  array<string, mixed>  $value */
    protected function write(Entry $entry, array $value, Product $product, string $hash): void
    {
        $product->forceFill([
            'collection_id' => $entry->collection_id,
            'type' => $value['type'],
            'purchase_mode' => $value['purchase_mode'],
            'external_links' => $value['external_links'],
            'requires_shipping' => $value['requires_shipping'],
            'downloadable' => $value['downloadable'],
            'featured' => $value['featured'],
            'tax_class' => $value['tax_class'],
            'bundle_pricing' => $value['bundle']['pricing'] ?? null,
            'bundle_value' => $value['bundle']['value'] ?? null,
            'delivery' => $value['delivery'],
            'removed_at' => null,
        ])->save();

        // Options and their values, by uid.
        $taxonomies = Taxonomy::query()->whereIn('handle', array_filter(array_column($value['options'], 'taxonomy')))->pluck('id', 'handle');
        $valueRows = [];
        $keptOptions = [];
        foreach ($value['options'] as $position => $option) {
            $row = ProductOption::query()->updateOrCreate(
                ['product_id' => $product->id, 'uid' => $option['id']],
                ['name' => $option['name'], 'taxonomy_id' => $option['taxonomy'] !== null ? ($taxonomies[$option['taxonomy']] ?? null) : null, 'position' => $position],
            );
            $keptOptions[] = $row->id;
            $keptValues = [];
            foreach ($option['values'] as $i => $v) {
                $valueRow = ProductOptionValue::query()->updateOrCreate(
                    ['option_id' => $row->id, 'uid' => $v['id']],
                    ['label' => $v['label'] ?? null, 'term_id' => $v['term_id'] ?? null, 'position' => $i],
                );
                $keptValues[] = $valueRow->id;
                $valueRows[$option['id']][$v['id']] = $valueRow;
            }
            ProductOptionValue::query()->where('option_id', $row->id)->whereNotIn('id', $keptValues)->delete();
        }
        ProductOption::query()->where('product_id', $product->id)->whereNotIn('id', $keptOptions)->delete();

        // Labels of attribute values (main language) for variant titles.
        $termIds = collect($valueRows)->flatten()->pluck('term_id')->filter()->all();
        $termNames = $termIds === [] ? collect() : Term::query()->with('translations')->whereIn('id', $termIds)->get()->mapWithKeys(fn (Term $t) => [$t->id => (string) $t->name]);

        // Variants, by uid: restored when they come back, soft-deleted when removed.
        $existing = Variant::withTrashed()->where('product_id', $product->id)->get()->keyBy('uid');
        $kept = [];
        foreach ($value['variants'] as $position => $v) {
            $variant = $existing->get($v['id']) ?? new Variant(['product_id' => $product->id, 'uid' => $v['id']]);
            $isNew = ! $variant->exists;
            $labels = [];
            $valueIds = [];
            foreach ($value['options'] as $option) {
                $row = $valueRows[$option['id']][$v['options'][$option['id']] ?? ''] ?? null;
                if ($row !== null) {
                    $labels[] = $row->label ?? ($termNames[$row->term_id] ?? '');
                    $valueIds[] = $row->id;
                }
            }
            $variant->fill([
                'sku' => $v['sku'],
                'barcode' => $v['barcode'],
                'title' => implode(' / ', array_filter($labels, fn ($l) => $l !== '')),
                'price' => $v['price'],
                'compare_at_price' => $v['compare_at_price'],
                'cost' => $v['cost'],
                'weight' => $v['weight'],
                'length' => $v['length'],
                'width' => $v['width'],
                'height' => $v['height'],
                'image_asset_id' => $v['image'],
                'requires_shipping' => $v['requires_shipping'],
                'downloadable' => $v['downloadable'],
                'track_stock' => $v['track_stock'],
                'backorders' => $v['backorders'],
                'low_stock_threshold' => $v['low_stock_threshold'],
                'min_qty' => $v['min_qty'],
                'max_qty' => $v['max_qty'],
                'qty_step' => $v['qty_step'],
                'position' => $position,
                'is_default' => $position === 0,
                'active' => $v['active'],
            ]);
            // Stock is set once: the first time the variant is tracked.
            $initial = $v['track_stock'] && $variant->stock_quantity === null ? (int) ($v['initial_stock'] ?? 0) : null;
            if ($initial !== null) {
                $variant->stock_quantity = $initial;
            }
            $variant->stock_status = $v['track_stock'] ? $variant->computedStockStatus() : $v['stock_status'];
            if ($variant->trashed()) {
                $variant->setAttribute('deleted_at', null);
            }
            $variant->save();
            if ($initial !== null && ($initial !== 0 || $isNew)) {
                StockMovement::query()->create(['variant_id' => $variant->id, 'delta' => $initial, 'quantity_after' => $initial, 'reason' => 'initial', 'user_id' => auth(config('sunrice.auth.guard', 'web'))->id()]);
            }
            $variant->optionValues()->sync($valueIds);
            $kept[$v['id']] = $variant;
        }
        Variant::query()->where('product_id', $product->id)->whereNotIn('uid', array_keys($kept))->get()->each->delete();

        // Tiers and bundle items are replaced.
        PriceTier::query()->where('product_id', $product->id)->delete();
        foreach ($value['tiers'] as $position => $tier) {
            PriceTier::query()->create([
                'product_id' => $product->id,
                'variant_id' => $tier['variant'] !== null ? ($kept[$tier['variant']]->id ?? null) : null,
                'min_qty' => $tier['min_qty'], 'type' => $tier['type'], 'value' => $tier['value'], 'position' => $position,
            ]);
        }
        BundleItem::query()->where('product_id', $product->id)->delete();
        foreach ($value['bundle']['items'] ?? [] as $position => $item) {
            BundleItem::query()->create(['product_id' => $product->id, 'variant_id' => $item['variant_id'], 'quantity' => $item['quantity'], 'position' => $position]);
        }

        // Download files: attach the referenced ones, detach the rest (kept for existing grants).
        $attached = [];
        foreach ($value['downloads'] as $d) {
            $attached[] = [$d, null];
        }
        foreach ($value['variants'] as $v) {
            foreach ($v['downloads'] as $d) {
                $attached[] = [$d, $kept[$v['id']]->id];
            }
        }
        $keptFiles = [];
        foreach ($attached as [$d, $variantId]) {
            if ($d['type'] === 'url') {
                $file = DownloadFile::query()->updateOrCreate(['product_id' => $product->id, 'uid' => $d['id']], ['type' => 'url', 'name' => $d['name'] ?: 'Link', 'url' => $d['url'], 'variant_id' => $variantId, 'attached' => true]);
            } else {
                $file = DownloadFile::query()->whereKey($d['file_id'])->where(fn ($q) => $q->whereNull('product_id')->orWhere('product_id', $product->id))->first();
                $file?->forceFill(['product_id' => $product->id, 'variant_id' => $variantId, 'uid' => $d['id'], 'name' => $d['name'] ?: $file->filename, 'attached' => true])->save();
            }
            if ($file !== null) {
                $keptFiles[] = $file->id;
            }
        }
        DownloadFile::query()->where('product_id', $product->id)->whereNotIn('id', $keptFiles)->update(['attached' => false]);

        $product->forceFill(['data_hash' => $hash, 'sync_status' => 'ok', 'sync_error' => null, 'synced_at' => now()])->save();
        app(PriceIndex::class)->refresh($product);
    }

    /**
     * The value mapped to unsaved rows (for preview): a product with its
     * variants, options and tiers relations set. Stock comes from existing
     * variants with the same uid, or initial_stock.
     */
    public function map(mixed $raw, ?Product $existing = null): Product
    {
        $value = ProductValue::withIds(ProductValue::normalize($raw));
        $product = new Product([
            'type' => $value['type'], 'purchase_mode' => $value['purchase_mode'], 'external_links' => $value['external_links'],
            'requires_shipping' => $value['requires_shipping'], 'downloadable' => $value['downloadable'], 'featured' => $value['featured'],
            'tax_class' => $value['tax_class'], 'bundle_pricing' => $value['bundle']['pricing'] ?? null, 'bundle_value' => $value['bundle']['value'] ?? null,
            'sync_status' => 'ok',
        ]);
        if ($existing !== null) {
            $product->id = $existing->id;
            $product->entry_id = $existing->entry_id;
            $product->sales_count = $existing->sales_count;
        }
        $stock = $existing !== null ? $existing->variants()->get()->keyBy('uid') : collect();

        $labels = [];
        $options = collect((array) $value['options'])->map(function (array $option, int $position) use (&$labels) {
            $row = new ProductOption(['uid' => $option['id'], 'name' => $option['name'], 'position' => $position]);
            $row->setRelation('values', collect((array) $option['values'])->map(function (array $v, int $i) use ($option, &$labels) {
                $labels[$option['id']][$v['id']] = $v['label'] ?? '';

                return new ProductOptionValue(['uid' => $v['id'], 'label' => $v['label'] ?? null, 'term_id' => $v['term_id'] ?? null, 'position' => $i]);
            }));

            return $row;
        });
        $product->setRelation('options', $options);

        $variants = collect((array) $value['variants'])->map(function (array $v, int $position) use ($value, $stock, $labels, $product) {
            $saved = $stock->get($v['id']);
            $variant = new Variant([
                'uid' => $v['id'], 'sku' => $v['sku'], 'price' => $v['price'], 'compare_at_price' => $v['compare_at_price'],
                'title' => implode(' / ', array_filter(array_map(fn ($option) => $labels[$option['id']][$v['options'][$option['id']] ?? ''] ?? '', $value['options']))),
                'weight' => $v['weight'], 'image_asset_id' => $v['image'], 'track_stock' => $v['track_stock'],
                'stock_quantity' => $saved->stock_quantity ?? ($v['track_stock'] ? (int) ($v['initial_stock'] ?? 0) : null),
                'backorders' => $v['backorders'], 'low_stock_threshold' => $v['low_stock_threshold'],
                'min_qty' => $v['min_qty'], 'max_qty' => $v['max_qty'], 'qty_step' => $v['qty_step'],
                'position' => $position, 'is_default' => $position === 0, 'active' => $v['active'],
            ]);
            if ($saved !== null) {
                $variant->id = $saved->id;
            }
            $variant->stock_status = $v['track_stock'] ? $variant->computedStockStatus() : $v['stock_status'];
            $variant->setAttribute('option_uids', $v['options']);
            $variant->setRelation('product', $product);

            return $variant;
        });
        $product->setRelation('variants', $variants);
        $product->setRelation('tiers', collect((array) $value['tiers'])->map(fn (array $t) => new PriceTier(['min_qty' => $t['min_qty'], 'type' => $t['type'], 'value' => $t['value']])));

        $prices = $variants->where('active', true)->pluck('price');
        $product->forceFill(['min_price' => $prices->min(), 'max_price' => $prices->max(), 'in_stock' => $variants->contains(fn (Variant $v) => $v->active && $v->stock_status !== 'out_of_stock')]);

        return $product;
    }

    /**
     * The entry is gone for good: soft-delete the variants (order lines
     * keep them) and mark the product removed.
     */
    public function remove(int $entryId): void
    {
        $product = Product::query()->where('entry_id', $entryId)->first();
        if ($product === null) {
            return;
        }
        Variant::query()->where('product_id', $product->id)->get()->each->delete();
        $product->forceFill(['removed_at' => now(), 'in_stock' => false])->save();
    }

    /** Whether an entry still exists (in the trash included). */
    public static function entryExists(int $entryId): bool
    {
        return Entry::query()->withTrashed()->withoutGlobalScope(HiddenWithParent::class)->whereKey($entryId)->exists();
    }
}
