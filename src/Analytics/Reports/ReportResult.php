<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

/**
 * What a report returns: columns (key, label, kind: text | money | count
 * | percent | date), rows of raw values (an optional `href` drills down),
 * an optional totals row, chart and summary figures with comparison.
 */
final readonly class ReportResult
{
    /**
     * @param  array<int, array{key: string, label: string, kind: string}>  $columns
     * @param  array<int, array<string, mixed>>  $rows
     * @param  array<string, mixed>|null  $totals
     * @param  array{kind: string, xKey: string, series: array<int, array{key: string, label: string}>, data: array<int, array<string, mixed>>}|null  $chart
     * @param  array<int, array{key: string, label: string, kind: string, value: int|float, previous: int|float|null, change: float|null}>  $summary
     */
    public function __construct(
        public array $columns,
        public array $rows,
        public ?array $totals = null,
        public ?array $chart = null,
        public array $summary = [],
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return ['columns' => $this->columns, 'rows' => $this->rows, 'totals' => $this->totals, 'chart' => $this->chart, 'summary' => $this->summary];
    }
}
