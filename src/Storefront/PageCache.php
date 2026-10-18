<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Illuminate\Http\Request;
use Sunrice\Frontend\TemplateContext;
use Sunrice\Sunrice;

/**
 * Keeps store pages out of Sunrice's full-page cache (U11): commerce's
 * own pages, product pages, the shop and product term pages, any page
 * that showed a product (a products block on the home page), and every
 * page for a visitor with a cart or signed in as a customer. Other pages
 * are cached as usual.
 */
final class PageCache
{
    /** Request attribute set when a page shows prices or stock. */
    public const DYNAMIC = 'commerce.dynamic';

    public static function register(): void
    {
        // Sunrice::cachePageUsing() arrives with U11; before it, the health check warns about the cache.
        $add = [app(Sunrice::class), 'cachePageUsing'];
        if (is_callable($add)) {
            $add(fn (Request $request, ?TemplateContext $page): bool => self::cacheable($request, $page));
        }
    }

    public static function supported(): bool
    {
        return method_exists(Sunrice::class, 'cachePageUsing');
    }

    public static function cacheable(Request $request, ?TemplateContext $page): bool
    {
        if (str_starts_with((string) $request->route()?->getName(), 'commerce.') || $request->attributes->get(self::DYNAMIC)) {
            return false;
        }
        if ($request->cookies->has((string) config('commerce.cart.cookie', 'commerce_cart'))) {
            return false;
        }
        if (auth()->guard((string) config('commerce.auth.guard', 'commerce'))->check()) {
            return false;
        }
        $collections = (array) config('commerce.catalog.collections', ['products']);
        $taxonomies = array_filter([config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy'), config('commerce.catalog.tag_taxonomy')]);

        return match ($page?->pageType) {
            'entry', 'archive' => ! in_array($page->collection?->handle, $collections, true),
            'term' => ! in_array($page->taxonomy?->handle, $taxonomies, true),
            default => true,
        };
    }

    /** Marks the current page as showing prices or stock. */
    public static function markDynamic(): void
    {
        if (app()->bound('request')) {
            request()->attributes->set(self::DYNAMIC, true);
        }
    }
}
