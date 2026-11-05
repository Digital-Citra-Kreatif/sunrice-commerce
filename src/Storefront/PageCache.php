<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Sunrice\Cms\Events\ContentChanged;
use Sunrice\Cms\Site\Page;
use Sunrice\Cms\Site\PageCache as SitePageCache;
use Sunrice\Commerce\Cart\CompareList;
use Sunrice\Commerce\Feeds\ProductFeed;
use Sunrice\Commerce\Wishlist\WishlistManager;

/**
 * Store pages in the CMS's full-page cache. Commerce's own pages (cart,
 * checkout, account…) are never kept. Visitors with a cart, wishlist,
 * comparison or customer account always get fresh pages, so every kept
 * page is the one an anonymous visitor sees. Product, shop and product
 * term pages, and any page showing a product, are kept for those visitors
 * for commerce.cache.product_pages_ttl seconds, and cleared when a product
 * sells out or comes back, runs low, or prices change (pricing rules,
 * flash sales).
 */
final class PageCache
{
    /** Request attribute set when a page shows prices or stock. */
    public const DYNAMIC = 'commerce.dynamic';

    public static function register(): void
    {
        app(SitePageCache::class)
            ->skipWhen(fn (Request $request, ?Page $page): bool => ! self::cacheable($request, $page))
            ->lifetimeUsing(fn (Request $request, ?Page $page): ?int => self::showsProducts($request, $page) ? self::productPagesTtl() : null);
    }

    public static function cacheable(Request $request, ?Page $page): bool
    {
        if (str_starts_with((string) $request->route()?->getName(), 'commerce.') || self::personal($request)) {
            return false;
        }

        return ! self::showsProducts($request, $page) || self::productPagesTtl() > 0;
    }

    /**
     * A visitor whose pages show something of their own: a cart (the header
     * count), a wishlist or comparison (the buttons), a customer account
     * (the header link, their prices).
     */
    public static function personal(Request $request): bool
    {
        if ($request->cookies->has((string) config('commerce.cart.cookie', 'commerce_cart')) || $request->cookies->has(WishlistManager::COOKIE)) {
            return true;
        }
        if ($request->hasSession() && (array) $request->session()->get(CompareList::KEY, []) !== []) {
            return true;
        }

        return auth()->guard((string) config('commerce.auth.guard', 'commerce'))->check();
    }

    /** Product, shop and product term pages, and any page that showed a product. */
    public static function showsProducts(Request $request, ?Page $page): bool
    {
        if ($request->attributes->get(self::DYNAMIC)) {
            return true;
        }
        $collections = (array) config('commerce.catalog.collections', ['products']);
        $taxonomies = array_filter([config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy'), config('commerce.catalog.tag_taxonomy')]);

        return match ($page?->type) {
            Page::ENTRY, Page::LISTING => in_array($page->collection?->handle, $collections, true),
            Page::TERM => in_array($page->term?->term?->taxonomy?->handle, $taxonomies, true),
            default => false,
        };
    }

    public static function productPagesTtl(): int
    {
        return max(0, (int) config('commerce.cache.product_pages_ttl', 300));
    }

    /** Marks the current page as showing prices or stock. */
    public static function markDynamic(): void
    {
        if (app()->bound('request')) {
            request()->attributes->set(self::DYNAMIC, true);
        }
    }

    /**
     * Clear the full-page cache and the product feed once the current
     * transaction commits: prices or availability shown on product pages changed.
     */
    public static function forget(string $reason): void
    {
        ProductFeed::forget();
        if (! SitePageCache::enabled()) {
            return;
        }
        DB::afterCommit(fn () => ContentChanged::dispatch('commerce.'.$reason));
    }
}
