<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Reads the daily stats tables: totals, series and the dashboard KPIs. */
class Stats
{
    public const COLUMNS = ['orders', 'items_sold', 'gross_sales', 'discounts', 'refunds', 'net_sales', 'shipping', 'taxes', 'fees', 'total_sales',
        'new_customers', 'returning_customers', 'quotes_requested', 'carts_created', 'checkouts_started'];

    /** KPI => [label, kind] */
    public const KPIS = [
        'total_sales' => ['Total sales', 'money'],
        'orders' => ['Orders', 'count'],
        'aov' => ['Average order value', 'money'],
        'items_sold' => ['Items sold', 'count'],
        'new_customers' => ['New customers', 'count'],
    ];

    /** @return array<string, int> */
    public function totals(string $from, string $to): array
    {
        $row = (array) DB::table('commerce_stats_daily')->whereBetween('date', [$from, $to])
            ->selectRaw(implode(', ', array_map(fn ($c) => "coalesce(sum({$c}), 0) as {$c}", self::COLUMNS)))->first();
        $totals = array_map('intval', $row);
        $totals['aov'] = $totals['orders'] > 0 ? intdiv($totals['net_sales'], $totals['orders']) : 0;

        return $totals;
    }

    /**
     * The columns per bucket of the period, every bucket present.
     *
     * @param  array<int, string>  $columns
     * @return array<string, array<string, int>> bucket start => column => value
     */
    public function series(Period $period, array $columns): array
    {
        $out = array_fill_keys($period->buckets(), array_fill_keys($columns, 0));
        $rows = DB::table('commerce_stats_daily')->whereBetween('date', [$period->from, $period->to])->orderBy('date')->get(['date', ...$columns]);
        foreach ($rows as $row) {
            $bucket = $period->bucket(substr((string) $row->date, 0, 10));
            foreach ($columns as $column) {
                $out[$bucket][$column] += (int) $row->{$column};
            }
        }

        return $out;
    }

    /**
     * The dashboard figures with their change against the comparison period.
     *
     * @return array<int, array{key: string, label: string, value: string, raw: int, previous: int|null, change: float|null}>
     */
    public function kpis(Period $period): array
    {
        $money = app(MoneyFormatter::class);
        $now = $this->totals($period->from, $period->to);
        $before = $period->compares() ? $this->totals((string) $period->compareFrom, (string) $period->compareTo) : null;
        $out = [];
        foreach (self::KPIS as $key => [$label, $kind]) {
            $previous = $before[$key] ?? null;
            $out[] = [
                'key' => $key, 'label' => $label,
                'value' => $kind === 'money' ? $money->format($now[$key]) : number_format($now[$key], 0, ',', '.'),
                'raw' => $now[$key], 'previous' => $previous,
                'change' => $previous ? round(($now[$key] - $previous) / abs($previous) * 100, 1) : null,
            ];
        }

        return $out;
    }

    /**
     * Products ranked by revenue in the range.
     *
     * @return array<int, array<string, mixed>>
     */
    public function topProducts(string $from, string $to, int $limit = 5): array
    {
        $rows = DB::table('commerce_product_stats_daily')->whereBetween('date', [$from, $to])->groupBy('product_id')
            ->selectRaw('product_id, sum(units_sold) as units, sum(revenue) as revenue')
            ->havingRaw('sum(units_sold) > 0')->orderByDesc('revenue')->limit($limit)->get();
        $titles = ProductTitles::for($rows->pluck('product_id')->map(fn ($id) => (int) $id)->all());
        $money = app(MoneyFormatter::class);

        return $rows->map(fn (object $r) => [
            'product_id' => (int) $r->product_id, 'title' => $titles[(int) $r->product_id]['title'] ?? "Product #{$r->product_id}",
            'href' => $titles[(int) $r->product_id]['href'] ?? null, 'units' => (int) $r->units, 'revenue' => $money->format((int) $r->revenue),
        ])->all();
    }
}
