<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\ProductTitles;
use Sunrice\Commerce\Settings\StoreSettings;

/** Stock now: variants low or out of stock, and the value of stock on hand at cost. */
class StockReport extends Report
{
    public function key(): string
    {
        return 'stock';
    }

    public function label(): string
    {
        return 'Stock';
    }

    public function description(): string
    {
        return 'Tracked variants that are low or out of stock right now. Stock value uses each variant\'s cost.';
    }

    public function feature(): ?string
    {
        return 'inventory';
    }

    public function usesDates(): bool
    {
        return false;
    }

    public function run(Period $period): ReportResult
    {
        $threshold = (int) app(StoreSettings::class)->get('catalog.low_stock_threshold', 5);
        $tracked = fn (): Builder => DB::table('commerce_variants as v')->join('commerce_products as p', 'p.id', '=', 'v.product_id')
            ->whereNull('v.deleted_at')->whereNull('p.removed_at')->where('v.active', true)->where('v.track_stock', true);
        $low = 'v.stock_quantity <= COALESCE(v.low_stock_threshold, ?)';
        $rows = $tracked()->whereRaw($low, [$threshold])->orderBy('v.stock_quantity')->limit(500)
            ->get(['v.id', 'v.product_id', 'v.sku', 'v.title', 'v.stock_quantity', 'v.cost']);
        $titles = ProductTitles::for($rows->pluck('product_id')->map(fn ($id) => (int) $id)->all());
        $value = (int) $tracked()->where('v.stock_quantity', '>', 0)->whereNotNull('v.cost')->sum(DB::raw('v.stock_quantity * v.cost'));
        $out = (int) $tracked()->where('v.stock_quantity', '<=', 0)->count();
        $lowCount = (int) $tracked()->where('v.stock_quantity', '>', 0)->whereRaw($low, [$threshold])->count();

        return new ReportResult(
            columns: [self::column('product', 'Product'), self::column('variant', 'Variant'), self::column('sku', 'SKU'),
                self::column('stock', 'In stock', 'count'), self::column('status', 'Status'), self::column('value', 'Value at cost', 'money')],
            rows: $rows->map(fn (object $r) => [
                'product' => $titles[(int) $r->product_id]['title'] ?? "Product #{$r->product_id}", 'variant' => (string) $r->title, 'sku' => (string) $r->sku,
                'stock' => (int) $r->stock_quantity, 'status' => (int) $r->stock_quantity <= 0 ? 'Out of stock' : 'Low',
                'value' => $r->cost !== null ? max(0, (int) $r->stock_quantity) * (int) $r->cost : null,
                'href' => 'commerce/inventory?search='.rawurlencode((string) ($r->sku ?: $r->title)),
            ])->all(),
            summary: self::summary(['low' => $lowCount, 'out' => $out, 'value' => $value], null, [
                'low' => ['Low on stock', 'count'], 'out' => ['Out of stock', 'count'], 'value' => ['Stock value at cost', 'money'],
            ]),
        );
    }
}
