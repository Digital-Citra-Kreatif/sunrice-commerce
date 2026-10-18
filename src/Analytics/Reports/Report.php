<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Sunrice\Commerce\Analytics\Period;

/**
 * A report on Shop → Reports (ARCHITECTURE.md §20). Extensions register
 * their own with Commerce::registerReport().
 */
abstract class Report
{
    abstract public function key(): string;

    abstract public function label(): string;

    abstract public function run(Period $period): ReportResult;

    public function description(): string
    {
        return '';
    }

    /** The module the report needs, or null. */
    public function feature(): ?string
    {
        return null;
    }

    /** False for reports about now (stock), which ignore the date range. */
    public function usesDates(): bool
    {
        return true;
    }

    /** @return array{key: string, label: string, kind: string} */
    protected static function column(string $key, string $label, string $kind = 'text'): array
    {
        return ['key' => $key, 'label' => $label, 'kind' => $kind];
    }

    /**
     * Summary figures with their change against the comparison period.
     *
     * @param  array<string, int|float>  $now
     * @param  array<string, int|float>|null  $before
     * @param  array<string, array{0: string, 1: string}>  $metrics  key => [label, kind]
     * @return array<int, array{key: string, label: string, kind: string, value: int|float, previous: int|float|null, change: float|null}>
     */
    protected static function summary(array $now, ?array $before, array $metrics): array
    {
        $out = [];
        foreach ($metrics as $key => [$label, $kind]) {
            $value = $now[$key] ?? 0;
            $previous = $before === null ? null : ($before[$key] ?? 0);
            $out[] = ['key' => $key, 'label' => $label, 'kind' => $kind, 'value' => $value, 'previous' => $previous,
                'change' => $previous ? round(($value - $previous) / abs($previous) * 100, 1) : null];
        }

        return $out;
    }

    /** Units sold per 100 views, or null without views. */
    protected static function rate(int|float $part, int|float $whole): ?float
    {
        return $whole > 0 ? round($part / $whole * 100, 1) : null;
    }
}
