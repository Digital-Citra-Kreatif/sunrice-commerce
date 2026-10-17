<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Regions;

/** ISO 3166-1 alpha-2 countries with English and Indonesian names. */
final class Countries
{
    /** @var array<string, array{en: string, id: string}>|null */
    protected static ?array $all = null;

    /** @return array<string, array{en: string, id: string}> */
    public static function all(): array
    {
        return self::$all ??= require __DIR__.'/../../resources/data/countries.php';
    }

    public static function exists(string $code): bool
    {
        return isset(self::all()[strtoupper($code)]);
    }

    public static function name(string $code, ?string $locale = null): string
    {
        $country = self::all()[strtoupper($code)] ?? null;
        if ($country === null) {
            return strtoupper($code);
        }

        return ($locale ?? app()->getLocale()) === 'id' ? $country['id'] : $country['en'];
    }

    /** @return array<int, array{value: string, label: string}> sorted by name, for selects */
    public static function options(?string $locale = null): array
    {
        $options = [];
        foreach (array_keys(self::all()) as $code) {
            $options[] = ['value' => $code, 'label' => self::name($code, $locale)];
        }
        usort($options, fn (array $a, array $b) => strcmp($a['label'], $b['label']));

        return $options;
    }
}
