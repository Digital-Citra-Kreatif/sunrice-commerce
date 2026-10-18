<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\CountedOrders;
use Sunrice\Commerce\Analytics\Period;

/** Vouchers: orders using each code, the discount given and those orders' revenue. */
class VouchersReport extends Report
{
    public function key(): string
    {
        return 'vouchers';
    }

    public function label(): string
    {
        return 'Vouchers';
    }

    public function feature(): ?string
    {
        return 'vouchers';
    }

    public function run(Period $period): ReportResult
    {
        // One row per (code, order) first, so an order's total counts once per code.
        $perOrder = DB::table('commerce_order_adjustments')->where('source_type', 'voucher')->whereNotNull('code')
            ->whereIn('order_id', CountedOrders::between($period->from, $period->to)->select('id'))
            ->groupBy('code', 'order_id')->selectRaw('code, order_id, sum(amount) as amount');
        $rows = DB::query()->fromSub($perOrder, 'a')->join('commerce_orders as o', 'o.id', '=', 'a.order_id')
            ->groupBy('a.code')->selectRaw('a.code, count(*) as uses, sum(a.amount) as amount, sum(o.total) as revenue')
            ->orderByDesc('uses')->get();
        $vouchers = DB::table('commerce_vouchers')->whereIn('code', $rows->pluck('code'))->pluck('id', 'code');

        return new ReportResult(
            columns: [self::column('code', 'Code'), self::column('uses', 'Orders', 'count'), self::column('discount', 'Discount given', 'money'), self::column('revenue', 'Revenue', 'money')],
            rows: $rows->map(fn (object $r) => [
                'code' => (string) $r->code, 'uses' => (int) $r->uses, 'discount' => abs((int) $r->amount), 'revenue' => (int) $r->revenue,
                'href' => isset($vouchers[$r->code]) ? "commerce/vouchers/{$vouchers[$r->code]}/edit" : null,
            ])->all(),
            totals: ['code' => 'Total', 'uses' => (int) $rows->sum('uses'), 'discount' => abs((int) $rows->sum('amount')), 'revenue' => (int) $rows->sum('revenue')],
        );
    }
}
