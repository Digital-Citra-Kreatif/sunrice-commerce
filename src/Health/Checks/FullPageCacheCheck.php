<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Sunrice\Cms\Site\PageCache as SitePageCache;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Storefront\PageCache;

/**
 * Says how the CMS's full-page cache treats store pages (ARCHITECTURE.md
 * §26): commerce's own pages and visitors with a cart, wishlist or
 * account are never kept, product pages briefly (Storefront\PageCache).
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
