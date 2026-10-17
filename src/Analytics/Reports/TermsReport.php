<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Support\Locales;

/**
 * Sales grouped by the terms of one product taxonomy (categories, brands).
 * A product in two categories counts in both.
 */
abstract class TermsReport extends Report
{
    abstract protected function taxonomy(): string;

    abstract protected function termLabel(): string;

    public function run(Period $period): ReportResult
    {
        $taxonomyId = DB::table('sunrice_taxonomies')->where('handle', $this->taxonomy())->value('id');
        $rows = $taxonomyId === null ? collect() : DB::table('commerce_product_stats_daily as s')
            ->join('commerce_products as p', 'p.id', '=', 's.product_id')
            ->join('sunrice_entry_term as et', 'et.entry_id', '=', 'p.entry_id')
            ->join('sunrice_terms as t', fn ($j) => $j->on('t.id', '=', 'et.term_id')->where('t.taxonomy_id', $taxonomyId))
            ->leftJoin('sunrice_term_translations as tt', fn ($j) => $j->on('tt.term_id', '=', 't.id')->where('tt.locale', Locales::main()))
            ->whereBetween('s.date', [$period->from, $period->to])
            ->groupBy('t.id', 'tt.name')
            ->selectRaw('t.id, tt.name, count(distinct s.product_id) as products, sum(s.units_sold) as units, sum(s.revenue) as revenue, sum(s.views) as views')
            ->orderByDesc('revenue')->get();

        return new ReportResult(
            columns: [
                self::column('term', $this->termLabel()), self::column('products', 'Products', 'count'), self::column('units', 'Units sold', 'count'),
                self::column('revenue', 'Revenue', 'money'), self::column('views', 'Views', 'count'), self::column('conversion', 'Conversion', 'percent'),
            ],
            rows: $rows->map(fn (object $r) => [
                'term' => (string) ($r->name ?? "#{$r->id}"), 'products' => (int) $r->products, 'units' => (int) $r->units, 'revenue' => (int) $r->revenue,
                'views' => (int) $r->views, 'conversion' => self::rate((int) $r->units, (int) $r->views),
            ])->all(),
            chart: ['kind' => 'bar', 'xKey' => 'term', 'series' => [['key' => 'revenue', 'label' => 'Revenue']],
                'data' => $rows->take(12)->map(fn (object $r) => ['term' => (string) ($r->name ?? "#{$r->id}"), 'revenue' => (int) $r->revenue])->values()->all()],
        );
    }
}
