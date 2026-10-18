<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\ProductTitles;

/** Products: units, revenue, views, add-to-carts and conversion (units sold per 100 views). */
class ProductsReport extends Report
{
    public function key(): string
    {
        return 'products';
    }

    public function label(): string
    {
        return 'Products';
    }

    public function description(): string
    {
        return 'Conversion is units sold per 100 product page views.';
    }

    public function run(Period $period): ReportResult
    {
        $sum = fn (string $from, string $to) => DB::table('commerce_product_stats_daily')->whereBetween('date', [$from, $to])
            ->selectRaw('coalesce(sum(units_sold), 0) as units, coalesce(sum(revenue), 0) as revenue, coalesce(sum(views), 0) as views, coalesce(sum(add_to_carts), 0) as add_to_carts')->first();
        $rows = DB::table('commerce_product_stats_daily')->whereBetween('date', [$period->from, $period->to])->groupBy('product_id')
            ->selectRaw('product_id, sum(units_sold) as units, sum(revenue) as revenue, sum(views) as views, sum(add_to_carts) as add_to_carts')
            ->orderByDesc('revenue')->orderByDesc('views')->limit(500)->get();
        $titles = ProductTitles::for($rows->pluck('product_id')->map(fn ($id) => (int) $id)->all());
        $now = array_map('intval', (array) $sum($period->from, $period->to));
        $before = $period->compares() ? array_map('intval', (array) $sum((string) $period->compareFrom, (string) $period->compareTo)) : null;

        return new ReportResult(
            columns: [
                self::column('product', 'Product'), self::column('units', 'Units sold', 'count'), self::column('revenue', 'Revenue', 'money'),
                self::column('views', 'Views', 'count'), self::column('add_to_carts', 'Add to carts', 'count'), self::column('conversion', 'Conversion', 'percent'),
            ],
            rows: $rows->map(fn (object $r) => [
                'product' => $titles[(int) $r->product_id]['title'] ?? "Product #{$r->product_id}", 'href' => $titles[(int) $r->product_id]['href'] ?? null,
                'units' => (int) $r->units, 'revenue' => (int) $r->revenue, 'views' => (int) $r->views, 'add_to_carts' => (int) $r->add_to_carts,
                'conversion' => self::rate((int) $r->units, (int) $r->views),
            ])->all(),
            totals: ['product' => 'Total', ...$now, 'conversion' => self::rate($now['units'], $now['views'])],
            summary: self::summary($now, $before, ['units' => ['Units sold', 'count'], 'revenue' => ['Revenue', 'money'], 'views' => ['Views', 'count'], 'add_to_carts' => ['Add to carts', 'count']]),
        );
    }
}
