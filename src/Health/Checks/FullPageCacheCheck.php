<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Sunrice\Cms\Site\PageCache as SitePageCache;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Storefront\PageCache;

/**
 * Sunrice's full-page cache wraps every frontend page, product pages
 * included, so stock, prices and the header cart would be served stale
 * (ARCHITECTURE.md §26). With Sunrice's cache profile (U11) commerce
 * leaves them out (Storefront\PageCache); otherwise, warn.
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
        if (! SitePageCache::enabled()) {
            return HealthResult::ok('The full-page cache is off, so store pages are always fresh.');
        }
        $ttl = PageCache::productPagesTtl();

        return HealthResult::ok($ttl > 0
            ? "The full-page cache is on; store pages and visitors with a cart, wishlist or account are left out of it, and product pages are kept for {$ttl} seconds at most."
            : 'The full-page cache is on; store pages, product pages and visitors with a cart or account are left out of it.');
    }
}
