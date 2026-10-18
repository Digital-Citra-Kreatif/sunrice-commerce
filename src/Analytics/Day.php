<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

/**
 * Days are the site's local dates (Settings → General → timezone, which
 * Sunrice applies as app.timezone, so stored timestamps are local too).
 */
final class Day
{
    /** The local date (Y-m-d) of a moment. */
    public static function of(CarbonInterface|string|null $moment): string
    {
        $moment ??= now();

        return Carbon::parse($moment)->setTimezone((string) config('app.timezone'))->toDateString();
    }

    /**
     * [start, end) of a local date, as stored timestamps.
     *
     * @return array{0: string, 1: string}
     */
    public static function bounds(string $date): array
    {
        $start = Carbon::parse($date, (string) config('app.timezone'))->startOfDay();

        return [$start->toDateTimeString(), $start->copy()->addDay()->toDateTimeString()];
    }

    /**
     * Every local date from $from to $to, inclusive.
     *
     * @return array<int, string>
     */
    public static function range(string $from, string $to): array
    {
        $days = [];
        for ($day = Carbon::parse($from); $day->toDateString() <= $to; $day->addDay()) {
            $days[] = $day->toDateString();
        }

        return $days;
    }
}
