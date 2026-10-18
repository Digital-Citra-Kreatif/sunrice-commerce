<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

/** Phone numbers in E.164 (+62812…), defaulting to Indonesian numbers. */
final class Phone
{
    /** Country calling codes for the countries whose national format is handled. */
    public const CALLING_CODES = ['ID' => '62', 'MY' => '60', 'SG' => '65'];

    /** "0812-3456-789" → "+628123456789"; null when it can't be a phone number. */
    public static function normalize(?string $phone, string $country = 'ID'): ?string
    {
        if ($phone === null) {
            return null;
        }
        $digits = preg_replace('/[^\d+]/', '', $phone) ?? '';
        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '+')) {
            $digits = '+'.ltrim(substr($digits, 1), '+');
        } elseif (str_starts_with($digits, '00')) {
            $digits = '+'.substr($digits, 2);
        } else {
            $code = self::CALLING_CODES[strtoupper($country)] ?? '62';
            $digits = str_starts_with($digits, $code) ? '+'.$digits : '+'.$code.ltrim($digits, '0');
        }

        return preg_match('/^\+\d{8,15}$/', $digits) === 1 ? $digits : null;
    }

    /** For wa.me links: digits only, no plus. */
    public static function whatsapp(?string $phone, string $country = 'ID'): ?string
    {
        $normalized = self::normalize($phone, $country);

        return $normalized === null ? null : ltrim($normalized, '+');
    }
}
