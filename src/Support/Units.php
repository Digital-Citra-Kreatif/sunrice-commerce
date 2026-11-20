<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Weights are stored in grams and sizes in millimetres; the store's units
 * (general.weight_unit: g | kg, general.dimension_unit: mm | cm | m) are
 * how they are shown and typed. Changing a unit converts nothing.
 */
final class Units
{
    public const WEIGHT = ['g' => 1, 'kg' => 1000];

    public const DIMENSION = ['mm' => 1, 'cm' => 10, 'm' => 1000];

    /** "1,25 kg" / "1.250 g" for grams, in the store's weight unit. */
    public static function weight(?int $grams): ?string
    {
        if ($grams === null) {
            return null;
        }
        $unit = (string) app(StoreSettings::class)->get('general.weight_unit', 'kg');
        $unit = isset(self::WEIGHT[$unit]) ? $unit : 'kg';

        return self::number($grams / self::WEIGHT[$unit]).' '.$unit;
    }

    /** "12,5 cm" for millimetres, in the store's dimension unit. */
    public static function dimension(?int $millimetres): ?string
    {
        if ($millimetres === null) {
            return null;
        }
        $unit = (string) app(StoreSettings::class)->get('general.dimension_unit', 'cm');
        $unit = isset(self::DIMENSION[$unit]) ? $unit : 'cm';

        return self::number($millimetres / self::DIMENSION[$unit]).' '.$unit;
    }

    /** Up to 3 decimals, none trailing, in the store's separators. */
    protected static function number(float $value): string
    {
        $currency = (array) app(StoreSettings::class)->get('general.currency', []);
        $decimal = (string) ($currency['decimal'] ?? ',');
        $thousands = (string) ($currency['thousands'] ?? '.');
        $text = number_format($value, 3, $decimal, $thousands);

        return str_contains($text, $decimal) ? rtrim(rtrim($text, '0'), $decimal) : $text;
    }
}
