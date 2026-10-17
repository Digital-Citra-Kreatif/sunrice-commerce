<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

/**
 * Recomputes one day of commerce_stats_daily and the sales columns of
 * commerce_product_stats_daily from orders and refunds (ARCHITECTURE.md
 * §20). Idempotent: running it twice, or out of order, gives the same
 * rows. Counters (views, clicks, carts) are left alone.
 */
class StatsRecorder
{
    public function recompute(string $date): void
    {
        [$from, $to] = Day::bounds($date);
        $orders = CountedOrders::query()->where('placed_at', '>=', $from)->where('placed_at', '<', $to);

        $sums = (clone $orders)->selectRaw('count(*) as orders, coalesce(sum(subtotal), 0) as gross, coalesce(sum(discount_total), 0) as discounts,
            coalesce(sum(shipping_total), 0) as shipping, coalesce(sum(tax_total), 0) as taxes, coalesce(sum(fee_total), 0) as fees, coalesce(sum(total), 0) as total')->first();
        $products = DB::table('commerce_order_items')->whereNull('parent_id')->whereNotNull('product_id')
            ->whereIn('order_id', (clone $orders)->select('id'))
            ->groupBy('product_id')->selectRaw('product_id, sum(quantity) as units, sum(total) as revenue')->get();
        $items = (int) DB::table('commerce_order_items')->whereNull('parent_id')->whereIn('order_id', (clone $orders)->select('id'))->sum('quantity');
        // Refunds count on the day they were made.
        $refunds = (int) DB::table('commerce_refunds')->where('status', 'completed')
            ->where('created_at', '>=', $from)->where('created_at', '<', $to)
            ->whereIn('order_id', CountedOrders::query()->select('id'))->sum('amount');
        [$new, $returning] = $this->customers($orders, $from);
        $quotes = DB::table('commerce_orders')->where('type', 'quote')->whereNull('deleted_at')
            ->where('created_at', '>=', $from)->where('created_at', '<', $to)->count();

        $gross = (int) $sums->gross;
        $discounts = (int) $sums->discounts;
        $row = [
            'orders' => (int) $sums->orders, 'items_sold' => $items, 'gross_sales' => $gross, 'discounts' => $discounts, 'refunds' => $refunds,
            'net_sales' => $gross - $discounts - $refunds, 'shipping' => (int) $sums->shipping, 'taxes' => (int) $sums->taxes, 'fees' => (int) $sums->fees,
            // What customers paid, less refunds (taxes are already inside when prices include them).
            'total_sales' => (int) $sums->total - $refunds,
            'new_customers' => $new, 'returning_customers' => $returning, 'quotes_requested' => $quotes,
        ];

        DB::transaction(function () use ($date, $row, $products): void {
            $now = now();
            DB::table('commerce_stats_daily')->upsert([['date' => $date, ...$row, 'created_at' => $now, 'updated_at' => $now]], ['date'], [...array_keys($row), 'updated_at']);
            DB::table('commerce_product_stats_daily')->where('date', $date)->whereNotIn('product_id', $products->pluck('product_id')->all())
                ->where(fn ($q) => $q->where('units_sold', '>', 0)->orWhere('revenue', '!=', 0))
                ->update(['units_sold' => 0, 'revenue' => 0]);
            if ($products->isNotEmpty()) {
                DB::table('commerce_product_stats_daily')->upsert($products->map(fn (object $p) => [
                    'date' => $date, 'product_id' => (int) $p->product_id, 'units_sold' => (int) $p->units, 'revenue' => (int) $p->revenue,
                ])->all(), ['date', 'product_id'], ['units_sold', 'revenue']);
            }
        });
    }

    /** Recomputes every day from $from to $to (inclusive); returns the number of days. */
    public function rebuild(string $from, string $to): int
    {
        $days = Day::range($from, $to);
        foreach ($days as $day) {
            $this->recompute($day);
        }

        return count($days);
    }

    /**
     * Customers ordering that day: new when it is their first counted order, else returning.
     *
     * @return array{0: int, 1: int}
     */
    protected function customers(Builder $orders, string $from): array
    {
        $ids = (clone $orders)->whereNotNull('customer_id')->distinct()->pluck('customer_id')->all();
        if ($ids === []) {
            return [0, 0];
        }
        $new = 0;
        foreach (array_chunk($ids, 500) as $chunk) {
            $new += DB::query()->fromSub(CountedOrders::query()->whereIn('customer_id', $chunk)->groupBy('customer_id')
                ->havingRaw('min(placed_at) >= ?', [$from])->select('customer_id'), 'first_orders')->count();
        }

        return [$new, count($ids) - $new];
    }
}
