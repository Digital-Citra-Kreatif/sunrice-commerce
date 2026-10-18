<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Reports;

use Sunrice\Commerce\Features\Features;

/** The report registry: built-in reports first, then extensions'. */
class Reports
{
    /** @var array<string, class-string<Report>> */
    protected array $classes = [];

    /** @param  class-string<Report>  $class */
    public function register(string $class): void
    {
        $this->classes[app($class)->key()] = $class;
    }

    /** @return array<string, Report> the reports whose module is on */
    public function available(): array
    {
        $features = app(Features::class);
        $out = [];
        foreach ($this->classes as $key => $class) {
            $report = app($class);
            if ($report->feature() === null || $features->active($report->feature())) {
                $out[$key] = $report;
            }
        }

        return $out;
    }

    public function find(string $key): ?Report
    {
        return $this->available()[$key] ?? null;
    }
}
