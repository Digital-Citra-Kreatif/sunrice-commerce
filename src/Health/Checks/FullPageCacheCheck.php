<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;

/**
 * Sunrice's full-page cache wraps every frontend page, product pages
 * included, so stock, prices and the header cart would be served stale
 * (ARCHITECTURE.md §26). Until Sunrice can exclude store pages, warn.
 */
class FullPageCacheCheck implements HealthCheck
{
    public function key(): string
    {
        return 'full_page_cache';
    }

    public function label(): string
    {
        return 'Full-page cache';
    }

    public function run(): HealthResult
    {
        if (config('sunrice.cache.full_page')) {
            return HealthResult::warning('Sunrice\'s full-page cache is on; product pages may show old prices, stock and cart contents.', 'Set sunrice.cache.full_page to false while the store is open.');
        }

        return HealthResult::ok('The full-page cache is off, so store pages are always fresh.');
    }
}
