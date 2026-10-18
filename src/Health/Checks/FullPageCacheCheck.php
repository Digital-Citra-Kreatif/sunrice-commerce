<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

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
        $profile = (string) config('responsecache.cache_profile');
        if (config('sunrice.cache.full_page') && PageCache::supported() && class_exists('Spatie\\ResponseCache\\CacheProfiles\\CacheAllSuccessfulGetRequests') && is_a($profile, 'Sunrice\\Cache\\FullPageCacheProfile', true)) {
            return PageCache::bypassSupported() && PageCache::productPagesTtl() > 0
                ? HealthResult::ok('The full-page cache is on; store pages and visitors with a cart, wishlist or account are left out of it, and product pages are kept for '.PageCache::productPagesTtl().' seconds at most.')
                : HealthResult::ok('The full-page cache is on; store pages, product pages and visitors with a cart or account are left out of it.');
        }
        if (config('sunrice.cache.full_page')) {
            return HealthResult::warning('Sunrice\'s full-page cache is on; product pages may show old prices, stock and cart contents.', 'Update Sunrice (its cache profile leaves store pages out), use Sunrice\\Cache\\FullPageCacheProfile as responsecache.cache_profile, or set sunrice.cache.full_page to false.');
        }

        return HealthResult::ok('The full-page cache is off, so store pages are always fresh.');
    }
}
