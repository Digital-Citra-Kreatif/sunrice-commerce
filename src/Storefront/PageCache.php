<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Cart\CompareList;
use Sunrice\Commerce\Wishlist\WishlistManager;
use Sunrice\Events\ContentChanged;
use Sunrice\Frontend\TemplateContext;
use Sunrice\Sunrice;

/**
 * Store pages in Sunrice's full-page cache (U11). Commerce's own pages
 * (cart, checkout, account…) are never cached. Visitors with a cart,
 * wishlist, comparison or customer account always get fresh pages, so
 * every cached page is the one an anonymous visitor sees. Product, shop
 * and product term pages, and any page showing a product, are cached for
 * those visitors for commerce.cache.product_pages_ttl seconds, and cleared
 * when a product sells out or comes back, runs low, or prices change
 * (pricing rules, flash sales).
 *
 * On Sunrice versions without Sunrice::bypassPageCacheUsing(), product
 * pages are left out instead, as before.
 */
final class PageCache
{
    /** Request attribute set when a page shows prices or stock. */
    public const DYNAMIC = 'commerce.dynamic';

    public static function register(): void
    {
        // Sunrice::cachePageUsing() arrives with U11; before it, the health check warns about the cache.
        $sunrice = app(Sunrice::class);
        $add = [$sunrice, 'cachePageUsing'];
        if (is_callable($add)) {
            $add(fn (Request $request, ?TemplateContext $page): bool => self::cacheable($request, $page));
        }
        // The bypass and lifetime hooks arrive later; without them product pages stay out.
        $bypass = [$sunrice, 'bypassPageCacheUsing'];
        $lifetime = [$sunrice, 'pageCacheLifetimeUsing'];
        if (is_callable($bypass) && is_callable($lifetime)) {
            $bypass(fn (Request $request): bool => self::personal($request));
            $lifetime(fn (Request $request, ?TemplateContext $page): ?int => self::showsProducts($request, $page) ? self::productPagesTtl() : null);
        }
    }

    public static function supported(): bool
    {
        return method_exists(Sunrice::class, 'cachePageUsing');
    }

    /** Whether Sunrice can send visitors past the cache before it serves a page. */
    public static function bypassSupported(): bool
    {
        return method_exists(Sunrice::class, 'bypassPageCacheUsing') && method_exists(Sunrice::class, 'pageCacheLifetimeUsing');
    }

    public static function cacheable(Request $request, ?TemplateContext $page): bool
    {
        if (str_starts_with((string) $request->route()?->getName(), 'commerce.') || self::personal($request)) {
            return false;
        }

        return ! self::showsProducts($request, $page) || (self::bypassSupported() && self::productPagesTtl() > 0);
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
    public static function showsProducts(Request $request, ?TemplateContext $page): bool
    {
        if ($request->attributes->get(self::DYNAMIC)) {
            return true;
        }
        $collections = (array) config('commerce.catalog.collections', ['products']);
        $taxonomies = array_filter([config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy'), config('commerce.catalog.tag_taxonomy')]);

        return match ($page?->pageType) {
            'entry', 'archive' => in_array($page->collection?->handle, $collections, true),
            'term' => in_array($page->taxonomy?->handle, $taxonomies, true),
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
     * Clear the full-page cache once the current transaction commits: prices
     * or availability shown on product pages changed.
     */
    public static function forget(string $reason): void
    {
        if (! config('sunrice.cache.full_page') || ! self::bypassSupported()) {
            return;
        }
        DB::afterCommit(fn () => ContentChanged::dispatch('commerce.'.$reason));
    }
}
