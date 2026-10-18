<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Sunrice\Commerce\Analytics\CountedOrders;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Stats;

/** Customers: new against returning over time, and the top customers by amount spent. */
class CustomersReport extends Report
{
    public function key(): string
    {
        return 'customers';
    }

    public function label(): string
    {
        return 'Customers';
    }

    public function description(): string
    {
        return 'A customer is new on the day of their first paid order, and returning after that.';
    }

    public function run(Period $period): ReportResult
    {
        $stats = app(Stats::class);
        $series = [];
        foreach ($stats->series($period, ['new_customers', 'returning_customers']) as $date => $values) {
            $series[] = ['date' => max($date, $period->from), ...$values];
        }
        $top = CountedOrders::between($period->from, $period->to)->whereNotNull('commerce_orders.customer_id')
            ->join('commerce_customers as c', 'c.id', '=', 'commerce_orders.customer_id')
            ->groupBy('c.id', 'c.name', 'c.email')
            ->selectRaw('c.id, c.name, c.email, count(*) as orders, sum(commerce_orders.total) as spent, max(commerce_orders.placed_at) as last_order')
            ->orderByDesc('spent')->limit(100)->get();
        $totals = $stats->totals($period->from, $period->to);
        $before = $period->compares() ? $stats->totals((string) $period->compareFrom, (string) $period->compareTo) : null;

        return new ReportResult(
            columns: [self::column('customer', 'Customer'), self::column('email', 'Email'), self::column('orders', 'Orders', 'count'),
                self::column('spent', 'Spent', 'money'), self::column('last_order', 'Last order', 'date')],
            rows: $top->map(fn (object $r) => [
                'customer' => (string) ($r->name ?: $r->email), 'email' => (string) $r->email, 'orders' => (int) $r->orders, 'spent' => (int) $r->spent,
                'last_order' => substr((string) $r->last_order, 0, 10), 'href' => "commerce/customers/{$r->id}",
            ])->all(),
            chart: ['kind' => 'bar', 'xKey' => 'date', 'series' => [['key' => 'new_customers', 'label' => 'New'], ['key' => 'returning_customers', 'label' => 'Returning']], 'data' => $series],
            summary: self::summary($totals, $before, ['new_customers' => ['New customers', 'count'], 'returning_customers' => ['Returning customers', 'count']]),
        );
    }
}
