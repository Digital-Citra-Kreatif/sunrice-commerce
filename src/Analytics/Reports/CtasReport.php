<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\ProductTitles;

/** Calls to action: WhatsApp, shop-link and inquiry clicks per product. */
class CtasReport extends Report
{
    public function key(): string
    {
        return 'ctas';
    }

    public function label(): string
    {
        return 'Calls to action';
    }

    public function description(): string
    {
        return 'Clicks on "Order on WhatsApp", marketplace links and "Ask about this product".';
    }

    public function run(Period $period): ReportResult
    {
        $rows = DB::table('commerce_product_stats_daily')->whereBetween('date', [$period->from, $period->to])->groupBy('product_id')
            ->selectRaw('product_id, sum(views) as views, sum(cta_whatsapp) as whatsapp, sum(cta_external) as external, sum(cta_inquiry) as inquiry')
            ->havingRaw('sum(cta_whatsapp) + sum(cta_external) + sum(cta_inquiry) > 0')
            ->orderByRaw('sum(cta_whatsapp) + sum(cta_external) + sum(cta_inquiry) desc')->limit(500)->get();
        $titles = ProductTitles::for($rows->pluck('product_id')->map(fn ($id) => (int) $id)->all());
        $mapped = $rows->map(fn (object $r) => [
            'product' => $titles[(int) $r->product_id]['title'] ?? "Product #{$r->product_id}", 'href' => $titles[(int) $r->product_id]['href'] ?? null,
            'views' => (int) $r->views, 'whatsapp' => (int) $r->whatsapp, 'external' => (int) $r->external, 'inquiry' => (int) $r->inquiry,
            'total' => (int) $r->whatsapp + (int) $r->external + (int) $r->inquiry,
            'rate' => self::rate((int) $r->whatsapp + (int) $r->external + (int) $r->inquiry, (int) $r->views),
        ]);

        return new ReportResult(
            columns: [self::column('product', 'Product'), self::column('views', 'Views', 'count'), self::column('whatsapp', 'WhatsApp', 'count'),
                self::column('external', 'Shop links', 'count'), self::column('inquiry', 'Inquiries', 'count'), self::column('total', 'Total clicks', 'count'),
                self::column('rate', 'Click rate', 'percent')],
            rows: $mapped->all(),
            totals: ['product' => 'Total', 'views' => $mapped->sum('views'), 'whatsapp' => $mapped->sum('whatsapp'), 'external' => $mapped->sum('external'),
                'inquiry' => $mapped->sum('inquiry'), 'total' => $mapped->sum('total'), 'rate' => self::rate($mapped->sum('total'), $mapped->sum('views'))],
        );
    }
}
