<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Http\Request as HttpRequest;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Reports\Reports;
use Sunrice\Commerce\Mcp\CommerceTool;

#[IsReadOnly]
#[Description('Run a store report, like Shop → Reports: sales (default: gross, discounts, refunds, net, shipping, taxes, total per day, week or month), products, categories, brands, vouchers, customers, stock or ctas (calls to action). Give period (today, 7d, 30d, 90d, month, last_month, year) or from and to (Y-m-d), and compare (previous, year, none). Money columns are integers in the smallest currency unit.')]
class SalesReportTool extends CommerceTool
{
    protected string $name = 'sales_report';

    protected ?string $feature = 'analytics';

    protected ?string $permission = 'commerce.reports.view';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'report' => ['nullable', 'string', 'max:40'], 'period' => ['nullable', 'string', 'max:20'],
            'from' => ['nullable', 'date_format:Y-m-d'], 'to' => ['nullable', 'date_format:Y-m-d'],
            'interval' => ['nullable', 'in:day,week,month'], 'compare' => ['nullable', 'in:previous,year,none'], 'limit' => ['nullable', 'integer', 'min:1', 'max:500'],
        ]);
        $reports = app(Reports::class);
        $report = $reports->find($args['report'] ?? 'sales');
        if ($report === null) {
            return Response::error('Unknown report. Available: '.implode(', ', array_keys($reports->available())).'.');
        }
        $period = Period::fromRequest(new HttpRequest(array_filter($args, fn ($v) => $v !== null)), '30d');
        $result = $report->run($period);

        return $this->json([
            'report' => $report->key(), 'label' => $report->label(), 'definition' => $report->description() ?: null,
            'period' => $report->usesDates() ? ['from' => $period->from, 'to' => $period->to, 'compare_from' => $period->compareFrom, 'compare_to' => $period->compareTo, 'interval' => $period->interval] : null,
            'summary' => $result->summary, 'columns' => array_column($result->columns, 'kind', 'key'),
            'rows' => array_slice(array_map(fn (array $r) => array_diff_key($r, ['href' => true]), $result->rows), 0, (int) ($args['limit'] ?? 100)),
            'row_count' => count($result->rows), 'totals' => $result->totals,
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'report' => $schema->string()->enum(['sales', 'products', 'categories', 'brands', 'vouchers', 'customers', 'stock', 'ctas']),
            'period' => $schema->string()->enum(array_keys(Period::PRESETS)),
            'from' => $schema->string(), 'to' => $schema->string(),
            'interval' => $schema->string()->enum(['day', 'week', 'month']),
            'compare' => $schema->string()->enum(['previous', 'year', 'none']),
            'limit' => $schema->integer()->description('Rows to return (default 100).'),
        ];
    }
}
