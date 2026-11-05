<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Sunrice\Cms\Site\Page;

/**
 * Swaps the CMS's generic templates for commerce's store views on product
 * pages, the shop page and product term pages. Templates the app
 * publishes (cms/collections/products/show.blade.php, …) are found first
 * by the CMS and kept. With Brands off, brand term pages answer 404.
 */
final class TemplateFallback
{
    /** The CMS's built-in views and an app's views for every collection or taxonomy. */
    public const GENERIC = [
        'sunrice-cms::entry', 'sunrice-cms::listing', 'sunrice-cms::term',
        'cms.collections.show', 'cms.collections.index', 'cms.taxonomies.show',
    ];

    public static function resolve(string $view, Page $page): ?string
    {
        $taxonomy = $page->type === Page::TERM ? $page->term?->term?->taxonomy?->handle : null;
        // With Brands off, brand pages don't exist (published templates included).
        if ($taxonomy !== null && $taxonomy === config('commerce.catalog.brand_taxonomy') && ! commerce_feature('brands')) {
            abort(404);
        }
        if (! in_array($view, self::GENERIC, true)) {
            return null;
        }
        $collections = (array) config('commerce.catalog.collections', ['products']);

        return match ($page->type) {
            Page::ENTRY => in_array($page->collection?->handle, $collections, true) ? Layout::view('product') : null,
            Page::LISTING => in_array($page->collection?->handle, $collections, true) ? Layout::view('shop') : null,
            Page::TERM => match ($taxonomy) {
                config('commerce.catalog.category_taxonomy') => Layout::view('category'),
                config('commerce.catalog.brand_taxonomy') => Layout::view('brand'),
                config('commerce.catalog.tag_taxonomy') => Layout::view('tag'),
                default => null,
            },
            default => null,
        };
    }
}
