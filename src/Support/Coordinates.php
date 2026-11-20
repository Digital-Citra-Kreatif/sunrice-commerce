<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

/** A map point typed as "latitude, longitude" (as Google Maps copies it). */
final class Coordinates
{
    public const PATTERN = '/^\s*-?\d{1,2}(\.\d+)?\s*,\s*-?\d{1,3}(\.\d+)?\s*$/';

    /** @return array{latitude: string, longitude: string}|null null when empty, malformed or off the map */
    public static function parse(mixed $text): ?array
    {
        if (! is_string($text) || ! preg_match(self::PATTERN, $text)) {
            return null;
        }
        [$lat, $lng] = array_map('trim', explode(',', $text));
        if (abs((float) $lat) > 90 || abs((float) $lng) > 180) {
            return null;
        }

        return ['latitude' => $lat, 'longitude' => $lng];
    }
}
