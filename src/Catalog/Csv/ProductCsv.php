<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Csv;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Support\Access;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Catalog\Actions\UpdateProductValues;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductValue;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Inventory\Actions\AdjustStock;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * Products as CSV, one row per variant, and changes to them from a CSV:
 * rows are matched by SKU and change only the columns given (a blank
 * cell keeps the value). Prices in the store's currency (a dot for
 * decimals); a compare-at price or cost of 0 clears it; stock sets a
 * tracked variant's quantity (a movement with the reason "import").
 */
class ProductCsv
{
    public const COLUMNS = ['sku', 'product', 'variant', 'price', 'compare_at_price', 'cost', 'stock', 'weight', 'active'];

    /** The columns an import may change. */
    public const CHANGEABLE = ['price', 'compare_at_price', 'cost', 'stock', 'weight', 'active'];

    public const MAX_ROWS = 5000;

    public function __construct(protected StoreSettings $settings) {}

    /**
     * Every variant of the products in these collections, for export.
     *
     * @param  list<int>  $collectionIds
     * @return \Generator<int, array<string, string|int|null>>
     */
    public function rows(array $collectionIds): \Generator
    {
        $query = Variant::query()->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
            ->leftJoin('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'commerce_products.entry_id')->where('t.locale', Locales::default()))
            ->whereNull('commerce_products.removed_at')->where('commerce_products.type', '!=', 'bundle')->whereIn('commerce_products.collection_id', $collectionIds)
            ->select('commerce_variants.*', 't.title as product_title');
        // In id order: lazyById pages by id, so any other order would skip or repeat rows.
        foreach ($query->lazyById(500, 'commerce_variants.id', 'id') as $v) {
            yield [
                'sku' => $v->sku, 'product' => (string) $v->getAttribute('product_title'), 'variant' => $v->title,
                'price' => $this->major((int) $v->price), 'compare_at_price' => $v->compare_at_price === null ? '' : $this->major((int) $v->compare_at_price),
                'cost' => $v->cost === null ? '' : $this->major((int) $v->cost), 'stock' => $v->track_stock ? (int) $v->stock_quantity : '',
                'weight' => $v->weight ?? '', 'active' => $v->active ? 'yes' : 'no',
            ];
        }
    }

    /**
     * What a CSV would change, row by row, without changing anything.
     *
     * @param  resource  $stream
     * @return array{rows: list<array{line: int, sku: string, product: string, changes: array<string, array{from: mixed, to: mixed}>, error: string|null}>, error: string|null}
     */
    public function preview($stream, Authorizable $user): array
    {
        $header = fgetcsv($stream, escape: '');
        if ($header === false || $header === [null]) {
            return ['rows' => [], 'error' => 'The file is empty.'];
        }
        $header = array_map(fn ($h) => strtolower(trim(preg_replace('/^\xEF\xBB\xBF/', '', (string) $h) ?? '')), $header);
        if (! in_array('sku', $header, true)) {
            return ['rows' => [], 'error' => 'The file needs a "sku" column.'];
        }
        $raw = [];
        $line = 1;
        while (($cells = fgetcsv($stream, escape: '')) !== false) {
            $line++;
            if ($cells === [null]) {
                continue;
            }
            if (count($raw) >= self::MAX_ROWS) {
                return ['rows' => [], 'error' => 'The file has more than '.self::MAX_ROWS.' rows: split it.'];
            }
            $cells = array_map(fn ($c) => $c === null ? null : self::uncell($c), array_slice($cells, 0, count($header)));
            $raw[$line] = array_combine($header, array_pad($cells, count($header), null));
        }
        // Every SKU of the file in one query, with what may be changed.
        $variants = Variant::query()->with('product')->whereIn('sku', collect($raw)->pluck('sku')->filter()->map(fn ($s) => trim((string) $s))->unique())->get()->keyBy('sku');
        $entries = Entry::query()->with(['collection', 'translations'])->whereIn('id', $variants->pluck('product.entry_id')->unique())->get()->keyBy('id');

        $rows = [];
        $seen = [];
        foreach ($raw as $n => $cells) {
            $sku = trim((string) ($cells['sku'] ?? ''));
            $variant = $variants->get($sku);
            $entry = $variant !== null ? $entries->get($variant->product->entry_id) : null;
            $row = ['line' => $n, 'sku' => $sku, 'product' => trim((string) $entry?->mainTranslation()?->title.($variant?->title ? ' — '.$variant->title : '')), 'changes' => [], 'error' => null];
            try {
                if ($variant === null || $entry === null || $variant->product->removed_at !== null) {
                    throw new \InvalidArgumentException($sku === '' ? 'No SKU.' : 'No product has this SKU.');
                }
                // Applied by SKU: a second row for it would silently win.
                if (isset($seen[$sku])) {
                    throw new \InvalidArgumentException("This SKU is on line {$seen[$sku]} too.");
                }
                $seen[$sku] = $n;
                if (! Access::entries($user, 'update', $entry->collection, $entry)) {
                    throw new \InvalidArgumentException('You may not edit this product.');
                }
                $row['changes'] = $this->changes($variant, $cells, $user);
            } catch (\InvalidArgumentException $e) {
                $row['error'] = $e->getMessage();
            }
            $rows[] = $row;
        }

        return ['rows' => $rows, 'error' => null];
    }

    /**
     * Apply a preview's rows without errors.
     *
     * @param  list<array{sku: string, changes: array<string, array{from: mixed, to: mixed}>, error: string|null}>  $rows
     * @return int variants changed
     */
    public function apply(array $rows, Authorizable $user): int
    {
        $rows = collect($rows)->filter(fn (array $r) => $r['error'] === null && $r['changes'] !== [])->keyBy('sku');
        if ($rows->isEmpty()) {
            return 0;
        }
        $variants = Variant::query()->with('product')->whereIn('sku', $rows->keys())->get();
        $userId = (int) $user->getAuthIdentifier();
        // Checked again here: a preview is kept an hour, and the permission or the module may have gone since.
        $mayAdjustStock = $user->can('commerce.inventory.adjust') && app(Features::class)->active('inventory');
        foreach ($variants->groupBy('product.entry_id') as $entryId => $group) {
            /** @var Collection<int, Variant> $group */
            $entry = Entry::query()->with('collection')->find($entryId);
            if ($entry === null || ! Access::entries($user, 'update', $entry->collection, $entry)) {
                continue;
            }
            $bySku = $group->mapWithKeys(fn (Variant $v) => [$v->uid => $rows[$v->sku]['changes']]);
            // A product's values and its stock change together, or not at all.
            DB::transaction(function () use ($entry, $bySku, $group, $rows, $mayAdjustStock, $userId): void {
                app(UpdateProductValues::class)->handle($entry, fn (array $value) => [...$value, 'variants' => array_map(function (array $v) use ($bySku) {
                    foreach ($bySku[$v['id']] ?? [] as $field => $change) {
                        if ($field !== 'stock') {
                            $v[$field] = $change['to'];
                        }
                    }

                    return $v;
                }, $value['variants'])]);
                foreach ($group as $variant) {
                    if ($mayAdjustStock && isset($rows[$variant->sku]['changes']['stock'])) {
                        app(AdjustStock::class)->handle($variant->fresh() ?? $variant, (int) $rows[$variant->sku]['changes']['stock']['to'], true, 'import', 'CSV import', $userId);
                    }
                }
            });
        }
        app(ActivityRecorder::class)->record('imported', $rows->count() === 1 ? '1 variant' : "{$rows->count()} variants", ['changes' => self::CHANGEABLE], 'products');

        return $rows->count();
    }

    /**
     * @param  array<string, string|null>  $cells
     * @return array<string, array{from: mixed, to: mixed}>
     */
    protected function changes(Variant $variant, array $cells, Authorizable $user): array
    {
        $changes = [];
        foreach (self::CHANGEABLE as $field) {
            $cell = trim((string) ($cells[$field] ?? ''));
            if ($cell === '') {
                continue;
            }
            [$from, $to] = match ($field) {
                'price' => [(int) $variant->price, $this->minor($cell, 'price', allowZero: true)],
                'compare_at_price', 'cost' => [$variant->{$field}, ($m = $this->minor($cell, $field, allowZero: true)) === 0 ? null : $m],
                'weight' => [$variant->weight, $this->whole($cell, 'weight')],
                'stock' => [$variant->track_stock ? (int) $variant->stock_quantity : null, $this->stock($variant, $cell, $user)],
                'active' => [$variant->active, $this->bool($cell)],
            };
            if ($from !== $to) {
                $changes[$field] = ['from' => $from, 'to' => $to];
            }
        }
        // Either one changing: the compare-at price (new or kept) must stay above the price (new or kept).
        $compareAt = array_key_exists('compare_at_price', $changes) ? $changes['compare_at_price']['to'] : $variant->compare_at_price;
        $price = $changes['price']['to'] ?? (int) $variant->price;
        if ((isset($changes['compare_at_price']) || isset($changes['price'])) && $compareAt !== null && (int) $compareAt <= $price) {
            throw new \InvalidArgumentException('The compare-at price must be above the price.');
        }

        return $changes;
    }

    /** A cell as typed: the export's leading apostrophe (Csv::cell(), against formulas) taken off again. */
    protected static function uncell(string $cell): string
    {
        return preg_match("/^'[=+\\-@\\t\\r]/", $cell) === 1 ? substr($cell, 1) : $cell;
    }

    protected function stock(Variant $variant, string $cell, Authorizable $user): int
    {
        if (! app(Features::class)->active('inventory')) {
            throw new \InvalidArgumentException('Stock tracking is switched off (Settings → Modules).');
        }
        if (! $variant->track_stock) {
            throw new \InvalidArgumentException("This variant doesn't track stock.");
        }
        if (! $user->can('commerce.inventory.adjust')) {
            throw new \InvalidArgumentException('You may not adjust stock.');
        }

        // An oversold variant exports its negative stock; it may stay, but stock is only ever set to 0 or more.
        $stock = $this->whole($cell, 'stock', negative: true);
        if ($stock < 0 && $stock !== (int) $variant->stock_quantity) {
            throw new \InvalidArgumentException("stock can't be set below 0.");
        }

        return $stock;
    }

    protected function minor(string $cell, string $field, bool $allowZero = false): int
    {
        $decimals = (int) $this->settings->get('general.currency.decimals', 0);
        $pattern = $decimals > 0 ? '/^\d+(\.\d{1,'.$decimals.'})?$/' : '/^\d+$/';
        if (preg_match($pattern, $cell) !== 1) {
            throw new \InvalidArgumentException("{$field}: \"{$cell}\" isn't an amount (digits".($decimals > 0 ? ', a dot for decimals' : ', no separators').').');
        }
        $minor = (int) round((float) $cell * (10 ** $decimals));
        if ($minor > ProductValue::MAX_PRICE) {
            throw new \InvalidArgumentException("{$field}: \"{$cell}\" is too high.");
        }
        if (! $allowZero && $minor === 0) {
            throw new \InvalidArgumentException("{$field} can't be 0.");
        }

        return $minor;
    }

    protected function whole(string $cell, string $field, bool $negative = false): int
    {
        if (preg_match($negative ? '/^-?\d{1,9}$/' : '/^\d{1,9}$/', $cell) !== 1) {
            throw new \InvalidArgumentException("{$field}: \"{$cell}\" isn't a whole number.");
        }

        return (int) $cell;
    }

    protected function bool(string $cell): bool
    {
        return match (strtolower($cell)) {
            'yes', 'y', '1', 'true', 'ya' => true,
            'no', 'n', '0', 'false', 'tidak' => false,
            default => throw new \InvalidArgumentException("active: \"{$cell}\" should be yes or no."),
        };
    }

    protected function major(int $minor): string
    {
        $decimals = (int) $this->settings->get('general.currency.decimals', 0);

        return number_format($minor / (10 ** $decimals), $decimals, '.', '');
    }
}
