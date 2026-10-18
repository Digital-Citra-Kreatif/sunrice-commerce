<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

/**
 * A date range (local dates, inclusive) with an optional comparison range
 * and the interval a series is grouped by.
 */
final readonly class Period
{
    public const PRESETS = ['today' => 'Today', '7d' => 'Last 7 days', '30d' => 'Last 30 days', '90d' => 'Last 90 days', 'month' => 'This month', 'last_month' => 'Last month', 'year' => 'This year'];

    public const INTERVALS = ['day', 'week', 'month'];

    public function __construct(
        public string $from,
        public string $to,
        public ?string $compareFrom = null,
        public ?string $compareTo = null,
        public string $interval = 'day',
        public ?string $preset = null,
    ) {}

    /** A preset range compared with the period just before it. */
    public static function preset(string $key): self
    {
        $today = Carbon::parse(Day::of(now()));
        [$from, $to] = match ($key) {
            'today' => [$today->copy(), $today->copy()],
            '7d' => [$today->copy()->subDays(6), $today->copy()],
            '90d' => [$today->copy()->subDays(89), $today->copy()],
            'month' => [$today->copy()->startOfMonth(), $today->copy()],
            'last_month' => [$today->copy()->subMonthNoOverflow()->startOfMonth(), $today->copy()->subMonthNoOverflow()->endOfMonth()],
            'year' => [$today->copy()->startOfYear(), $today->copy()],
            default => [$today->copy()->subDays(29), $today->copy()],
        };
        $key = isset(self::PRESETS[$key]) ? $key : '30d';

        return (new self($from->toDateString(), $to->toDateString(), preset: $key))->compared('previous');
    }

    /** From ?period= (a preset) or ?from=&to=, with ?compare=previous|year|none and ?interval=. */
    public static function fromRequest(Request $request, string $default = '30d'): self
    {
        $from = (string) $request->query('from', '');
        $to = (string) $request->query('to', '');
        $date = '/^\d{4}-\d{2}-\d{2}$/';
        if (preg_match($date, $from) === 1 && preg_match($date, $to) === 1 && $from <= $to) {
            $period = new self($from, $to);
        } else {
            $period = self::preset((string) $request->query('period', $default));
        }
        $interval = (string) $request->query('interval', '');
        $interval = in_array($interval, self::INTERVALS, true) ? $interval : ($period->days() > 92 ? 'month' : ($period->days() > 31 ? 'week' : 'day'));

        return $period->compared((string) $request->query('compare', 'previous'))->withInterval($interval);
    }

    public function compared(string $mode): self
    {
        $from = Carbon::parse($this->from);
        $to = Carbon::parse($this->to);
        [$cf, $ct] = match ($mode) {
            'previous' => [$from->copy()->subDays($this->days()), $from->copy()->subDay()],
            'year' => [$from->copy()->subYearNoOverflow(), $to->copy()->subYearNoOverflow()],
            default => [null, null],
        };

        return new self($this->from, $this->to, $cf?->toDateString(), $ct?->toDateString(), $this->interval, $this->preset);
    }

    public function withInterval(string $interval): self
    {
        return new self($this->from, $this->to, $this->compareFrom, $this->compareTo, $interval, $this->preset);
    }

    public function days(): int
    {
        return (int) Carbon::parse($this->from)->diffInDays(Carbon::parse($this->to)) + 1;
    }

    public function compares(): bool
    {
        return $this->compareFrom !== null && $this->compareTo !== null;
    }

    /** The comparison range as its own period (or null). */
    public function previous(): ?self
    {
        return $this->compares() ? new self((string) $this->compareFrom, (string) $this->compareTo, interval: $this->interval) : null;
    }

    /** The start date of the bucket a date falls in. */
    public function bucket(string $date): string
    {
        $day = Carbon::parse($date);

        return match ($this->interval) {
            'week' => $day->startOfWeek()->toDateString(),
            'month' => $day->startOfMonth()->toDateString(),
            default => $day->toDateString(),
        };
    }

    /** @return array<int, string> every bucket start in the range */
    public function buckets(): array
    {
        return array_values(array_unique(array_map(fn (string $d) => $this->bucket($d), Day::range($this->from, $this->to))));
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return ['from' => $this->from, 'to' => $this->to, 'compare_from' => $this->compareFrom, 'compare_to' => $this->compareTo,
            'interval' => $this->interval, 'preset' => $this->preset, 'presets' => self::PRESETS];
    }
}
