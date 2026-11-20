<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Csv;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Support\Access;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Catalog\Actions\UpdateProductValues;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Catalog\ProductValue;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Inventory\Actions\AdjustStock;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * @phpstan-type Change array{from: mixed, to: mixed}
 * @phpstan-type Row array{line: int, sku: string, variant_id?: int|null, changes: array<string, Change>, create?: array<string, mixed>|null, error: string|null}
 * @phpstan-type SkippedRow array{line: int, sku: string, reason: string}
 *
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
                'price' => $v->price === null ? '' : $this->major((int) $v->price), 'compare_at_price' => $v->compare_at_price === null ? '' : $this->major((int) $v->compare_at_price),
                'cost' => $v->cost === null ? '' : $this->major((int) $v->cost), 'stock' => $v->track_stock ? (int) $v->stock_quantity : '',
                'weight' => $v->weight ?? '', 'active' => $v->active ? 'yes' : 'no',
            ];
        }
    }

    /** Columns a new product's rows may add (with $create): option names the variant column, category a product category. */
    public const CREATE_COLUMNS = ['option', 'category'];

    /**
     * What a CSV would change, row by row, without changing anything. With
     * $create, a row whose SKU no product has and that names a product is a
     * new product (or a variant of one): ProductCsvCreator.
     *
     * @param  resource  $stream
     * @return array{rows: list<array{line: int, sku: string, variant_id?: int|null, product: string, changes: array<string, array{from: mixed, to: mixed}>, create?: array<string, mixed>|null, error: string|null}>, error: string|null}
     */
    public function preview($stream, Authorizable $user, bool $create = false): array
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
        $variants = Variant::query()->with('product')->whereIn('sku', collect($raw)->pluck('sku')->map(fn ($s) => trim((string) $s))->reject(fn (string $s) => $s === '')->unique())->get()->keyBy('sku');
        $entries = Entry::query()->with(['collection', 'translations'])->whereIn('id', $variants->pluck('product.entry_id')->unique())->get()->keyBy('id');

        $rows = [];
        $seen = [];
        foreach ($raw as $n => $cells) {
            $sku = trim((string) ($cells['sku'] ?? ''));
            $variant = $variants->get($sku);
            $entry = $variant !== null ? $entries->get($variant->product->entry_id) : null;
            $row = ['line' => $n, 'sku' => $sku, 'variant_id' => $variant?->id, 'product' => trim((string) $entry?->mainTranslation()?->title.($variant?->title ? ' — '.$variant->title : '')), 'changes' => [], 'create' => null, 'error' => null];
            try {
                if ($create && $variant === null && $sku !== '' && trim((string) ($cells['product'] ?? '')) !== '') {
                    if (isset($seen[$sku])) {
                        throw new \InvalidArgumentException("This SKU is on line {$seen[$sku]} too.");
                    }
                    $seen[$sku] = $n;
                    $row['create'] = app(ProductCsvCreator::class)->row($cells, $user,
                        fn (string $c, string $f, bool $zero) => $this->minor($c, $f, $zero), fn (string $c, string $f) => $this->whole($c, $f), fn (string $c) => $this->bool($c));
                    $row['product'] = trim((string) $cells['product'].(trim((string) ($cells['variant'] ?? '')) !== '' ? ' — '.trim((string) $cells['variant']) : ''));
                    $rows[] = $row;

                    continue;
                }
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

        return ['rows' => $create ? app(ProductCsvCreator::class)->check($rows) : $rows, 'error' => null];
    }

    /** @param  list<Row>  $rows */
    public function apply(array $rows, Authorizable $user): int
    {
        return $this->applyWithReport($rows, $user)['updated'];
    }

    /**
     * @param  list<Row>  $rows
     * @return array{updated: int, skipped: list<SkippedRow>}
     */
    public function applyWithReport(array $rows, Authorizable $user): array
    {
        $rows = collect($rows)->filter(fn (array $row) => $row['error'] === null && $row['changes'] !== [] && ($row['create'] ?? null) === null);
        $variants = Variant::query()->whereIntegerInRaw('id', $rows->pluck('variant_id')->filter()->all())->get()->keyBy('id');
        $groups = $rows->groupBy(fn (array $row) => $variants->get($row['variant_id'] ?? 0)->product_id ?? 0);
        $result = ['updated' => 0, 'skipped' => []];
        $mayAdjustStock = $user->can('commerce.inventory.adjust') && app(Features::class)->active('inventory');

        foreach ($groups as $productId => $group) {
            $groupRows = $group->values()->all();
            try {
                $applied = DB::transaction(fn () => $this->applyProduct((int) $productId, $groupRows, $user, $mayAdjustStock), 3);
            } catch (ValidationException $e) {
                $applied = $this->skipProduct($groupRows, $e->getMessage());
            }
            $result['updated'] += $applied['updated'];
            array_push($result['skipped'], ...$applied['skipped']);
        }
        if ($result['updated'] > 0) {
            $count = $result['updated'];
            app(ActivityRecorder::class)->record('imported', $count === 1 ? '1 variant' : "{$count} variants", ['changes' => self::CHANGEABLE], 'products');
        }
        usort($result['skipped'], fn (array $a, array $b) => $a['line'] <=> $b['line']);

        return $result;
    }

    /**
     * @param  list<Row>  $rows
     * @return array{updated: int, skipped: list<SkippedRow>}
     */
    protected function applyProduct(int $productId, array $rows, Authorizable $user, bool $mayAdjustStock): array
    {
        $product = Product::query()->find($productId);
        $entry = $product !== null ? Entry::query()->with('collection')->find($product->entry_id) : null;
        $reason = match (true) {
            $entry === null || $product->removed_at !== null => 'The original variant or product is no longer available. Preview the file again.',
            ! Access::entries($user, 'update', $entry->collection, $entry) => 'You may no longer edit this product.',
            default => null,
        };
        if ($reason !== null) {
            return $this->skipProduct($rows, $reason);
        }

        // Lock content before projecting and variants in the same order as stock reservations.
        $entry->setRelation('translations', $entry->translations()->orderBy('id')->lockForUpdate()->get());
        if (! $entry->mainTranslation()?->isPublished()) {
            return $this->skipProduct($rows, 'The product is no longer published.');
        }
        $variants = Variant::query()->where('product_id', $productId)->orderBy('id')->lockForUpdate()->get()->keyBy('id');
        $changesByUid = [];
        $stock = [];
        $skipped = [];
        $updated = 0;
        foreach ($rows as $row) {
            $variant = $variants->get($row['variant_id'] ?? 0);
            if ($variant === null || $variant->sku !== $row['sku']) {
                $skipped[] = $this->skipped($row, 'The original variant or SKU changed. Preview the file again.');

                continue;
            }

            $changes = $row['changes'];
            if (isset($changes['stock']) && ! $mayAdjustStock) {
                $skipped[] = $this->skipped($row, 'Stock was skipped because inventory is off or you no longer have permission.');
                unset($changes['stock']);
            }
            if ($changes === []) {
                continue;
            }
            if (($reason = $this->conflict($variant, $changes)) !== null) {
                $skipped[] = $this->skipped($row, $reason);

                continue;
            }
            if (isset($changes['stock'])) {
                $stock[$variant->id] = [$variant, (int) $changes['stock']['to']];
                unset($changes['stock']);
            }
            if ($changes !== []) {
                // Keep the column names, including fields intentionally cleared to null.
                $changesByUid[$variant->uid] = array_map(fn (array $change) => $change['to'], $changes);
            }
            $updated++;
        }

        if ($changesByUid !== []) {
            app(UpdateProductValues::class)->handle($entry, fn (array $value) => [...$value, 'variants' => array_map(
                fn (array $variant) => [...$variant, ...($changesByUid[$variant['id']] ?? [])],
                $value['variants'],
            )]);
            if ($product->refresh()->sync_status !== 'ok') {
                throw ValidationException::withMessages(['file' => 'The product could not be updated. Fix its product data before trying again.']);
            }
        }
        foreach ($stock as [$variant, $quantity]) {
            app(AdjustStock::class)->handle($variant->refresh(), $quantity, true, 'import', 'CSV import', (int) $user->getAuthIdentifier());
        }

        return ['updated' => $updated, 'skipped' => $skipped];
    }

    /** @param array<string, Change> $changes */
    protected function conflict(Variant $variant, array $changes): ?string
    {
        foreach ($changes as $field => $change) {
            $current = $field === 'stock'
                ? ($variant->track_stock ? (int) $variant->stock_quantity : null)
                : $variant->getAttribute($field);
            if ($current !== $change['from']) {
                return "The {$field} changed since preview. Preview the file again.";
            }
        }
        $price = $changes['price']['to'] ?? $variant->price;
        $compareAt = isset($changes['compare_at_price']) ? $changes['compare_at_price']['to'] : $variant->compare_at_price;
        if ((isset($changes['price']) || isset($changes['compare_at_price'])) && $compareAt !== null && (int) $compareAt <= (int) $price) {
            return 'The compare-at price must be above the current price. Preview the file again.';
        }

        return null;
    }

    /**
     * @param  list<Row>  $rows
     * @return array{updated: int, skipped: list<SkippedRow>}
     */
    protected function skipProduct(array $rows, string $reason): array
    {
        return ['updated' => 0, 'skipped' => array_map(fn (array $row) => $this->skipped($row, $reason), $rows)];
    }

    /**
     * @param  Row  $row
     * @return SkippedRow
     */
    protected function skipped(array $row, string $reason): array
    {
        return ['line' => $row['line'], 'sku' => $row['sku'], 'reason' => $reason];
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
        // In minor units as a string of digits, so a huge amount can't overflow (or round) on the way to an int.
        [$whole, $fraction] = explode('.', $cell.'.');
        $digits = ltrim($whole.str_pad($fraction, $decimals, '0'), '0');
        if (strlen($digits) > strlen((string) ProductValue::MAX_PRICE) || (int) $digits > ProductValue::MAX_PRICE) {
            throw new \InvalidArgumentException("{$field}: \"{$cell}\" is too high.");
        }
        $minor = (int) $digits;
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
