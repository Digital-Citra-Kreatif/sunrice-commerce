<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Facades\Cache;

/**
 * A counter bumped whenever listings may change (a product synced, stock
 * changed, content published); cached facets and listings are keyed by it.
 */
final class CatalogVersion
{
    public const KEY = 'commerce:catalog-version';

    public static function current(): int
    {
        return (int) Cache::rememberForever(self::KEY, fn () => 1);
    }

    public static function bump(): void
    {
        Cache::forever(self::KEY, self::current() + 1);
    }

    /** @param  \Closure(): mixed  $callback */
    public static function remember(string $key, int $seconds, \Closure $callback): mixed
    {
        return Cache::remember('commerce:catalog:'.self::current().':'.$key, $seconds, $callback);
    }
}
