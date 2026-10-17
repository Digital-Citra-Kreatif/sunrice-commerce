<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Formats and parses amounts with the store's currency format (Settings →
 * Store → General): symbol, its position, separators and decimals. Needs
 * no intl extension. Default: Rp150.000.
 */
class MoneyFormatter
{
    /** @param  array{symbol?: string, position?: string, space?: bool, thousands?: string, decimal?: string, decimals?: int}|null  $format */
    public function __construct(protected ?array $format = null) {}

    /** @return array{code: string, symbol: string, position: string, space: bool, thousands: string, decimal: string, decimals: int} */
    public function settings(): array
    {
        $stored = $this->format ?? (array) app(StoreSettings::class)->get('general.currency', []);

        return [
            'code' => (string) ($stored['code'] ?? 'IDR'),
            'symbol' => (string) ($stored['symbol'] ?? 'Rp'),
            'position' => ($stored['position'] ?? 'left') === 'right' ? 'right' : 'left',
            'space' => (bool) ($stored['space'] ?? false),
            'thousands' => (string) ($stored['thousands'] ?? '.'),
            'decimal' => (string) ($stored['decimal'] ?? ','),
            'decimals' => max(0, min(4, (int) ($stored['decimals'] ?? 0))),
        ];
    }

    public function format(int $amount, bool $withSymbol = true): string
    {
        $f = $this->settings();
        $factor = 10 ** $f['decimals'];
        $minor = abs($amount);
        $number = number_format(intdiv($minor, $factor), 0, '', $f['thousands']);
        if ($f['decimals'] > 0) {
            $number .= $f['decimal'].str_pad((string) ($minor % $factor), $f['decimals'], '0', STR_PAD_LEFT);
        }
        if ($withSymbol) {
            $gap = $f['space'] ? ' ' : '';
            $number = $f['position'] === 'left' ? $f['symbol'].$gap.$number : $number.$gap.$f['symbol'];
        }

        return ($amount < 0 ? '-' : '').$number;
    }

    /** "Rp150.000", "150.000" or "150000" → 150000; null when it isn't an amount. */
    public function parse(string $text): ?int
    {
        $f = $this->settings();
        $clean = preg_replace('/\s+/u', '', str_replace($f['symbol'], '', $text)) ?? '';
        $negative = str_starts_with($clean, '-');
        $clean = str_replace($f['thousands'], '', ltrim($clean, '-'));
        $parts = $f['decimals'] > 0 ? explode($f['decimal'], $clean, 2) : [$clean];
        $whole = $parts[0];
        $fraction = $parts[1] ?? '';
        if (! preg_match('/^\d*$/', $whole) || ! preg_match('/^\d*$/', $fraction) || $whole.$fraction === '') {
            return null;
        }
        $minor = (int) $whole * 10 ** $f['decimals'] + (int) substr(str_pad($fraction, $f['decimals'], '0'), 0, $f['decimals']);

        return $negative ? -$minor : $minor;
    }
}
