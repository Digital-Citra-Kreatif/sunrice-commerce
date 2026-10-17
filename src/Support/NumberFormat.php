<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use DateTimeInterface;
use Illuminate\Support\Carbon;

/**
 * Order, quote and invoice number formats: fixed text plus tokens
 * {Y} (2026), {y} (26), {m} (10), {d} (17), {seq} and {seq:N} (padded to
 * N digits). The sequence restarts per the reset rule: never, yearly,
 * monthly or daily.
 */
final class NumberFormat
{
    public const RESETS = ['never', 'yearly', 'monthly', 'daily'];

    public static function render(string $format, int $sequence, DateTimeInterface $at): string
    {
        $at = Carbon::instance($at);
        $out = strtr($format, [
            '{Y}' => $at->format('Y'),
            '{y}' => $at->format('y'),
            '{m}' => $at->format('m'),
            '{d}' => $at->format('d'),
            '{seq}' => (string) $sequence,
        ]);

        return (string) preg_replace_callback('/\{seq:(\d{1,2})\}/', fn (array $m) => str_pad((string) $sequence, (int) $m[1], '0', STR_PAD_LEFT), $out);
    }

    /** The counter key for a document type and reset rule: order, order:2026, order:2026-10, order:2026-10-17. */
    public static function key(string $type, string $reset, DateTimeInterface $at): string
    {
        $at = Carbon::instance($at);

        return match ($reset) {
            'yearly' => $type.':'.$at->format('Y'),
            'monthly' => $type.':'.$at->format('Y-m'),
            'daily' => $type.':'.$at->format('Y-m-d'),
            default => $type,
        };
    }

    /** A valid format has {seq} or {seq:N}. */
    public static function valid(string $format): bool
    {
        return preg_match('/\{seq(:\d{1,2})?\}/', $format) === 1 && mb_strlen($format) <= 60;
    }
}
