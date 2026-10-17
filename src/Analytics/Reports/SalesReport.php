<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Illuminate\Support\Carbon;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Stats;

/** Sales over time: gross, discounts, refunds, net, shipping, taxes, fees and total per day, week or month. */
class SalesReport extends Report
{
    public const MONEY = ['gross_sales', 'discounts', 'refunds', 'net_sales', 'shipping', 'taxes', 'fees', 'total_sales'];

    public function key(): string
    {
        return 'sales';
    }

    public function label(): string
    {
        return 'Sales over time';
    }

    public function description(): string
    {
        return 'Paid, processing and completed orders by the day they were placed; refunds on the day they were made.';
    }

    public function run(Period $period): ReportResult
    {
        $stats = app(Stats::class);
        $series = $stats->series($period, ['orders', 'items_sold', ...self::MONEY]);
        $buckets = array_keys($series);
        $rows = [];
        foreach ($buckets as $i => $start) {
            $end = isset($buckets[$i + 1]) ? Carbon::parse($buckets[$i + 1])->subDay()->toDateString() : $period->to;
            $start = max($start, $period->from);
            $rows[] = ['date' => $start, ...$series[$buckets[$i]], 'href' => "commerce/orders?filters[date]={$start}..{$end}"];
        }
        $totals = $stats->totals($period->from, $period->to);
        $before = $period->compares() ? $stats->totals((string) $period->compareFrom, (string) $period->compareTo) : null;

        return new ReportResult(
            columns: [
                self::column('date', ucfirst($period->interval), 'date'), self::column('orders', 'Orders', 'count'), self::column('items_sold', 'Items', 'count'),
                self::column('gross_sales', 'Gross sales', 'money'), self::column('discounts', 'Discounts', 'money'), self::column('refunds', 'Refunds', 'money'),
                self::column('net_sales', 'Net sales', 'money'), self::column('shipping', 'Shipping', 'money'), self::column('taxes', 'Taxes', 'money'),
                self::column('fees', 'Fees', 'money'), self::column('total_sales', 'Total', 'money'),
            ],
            rows: $rows,
            totals: ['date' => 'Total', ...array_intersect_key($totals, array_flip(['orders', 'items_sold', ...self::MONEY]))],
            chart: ['kind' => 'line', 'xKey' => 'date', 'series' => [['key' => 'net_sales', 'label' => 'Net sales'], ['key' => 'total_sales', 'label' => 'Total']], 'data' => $rows],
            summary: self::summary($totals, $before, [
                'gross_sales' => ['Gross sales', 'money'], 'net_sales' => ['Net sales', 'money'], 'total_sales' => ['Total sales', 'money'],
                'orders' => ['Orders', 'count'], 'aov' => ['Average order value', 'money'],
            ]),
        );
    }
}
