<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Sunrice\Frontend\TemplateContext;

/**
 * Swaps Sunrice's generic templates for commerce's store views on product
 * pages, the shop page and product term pages. Templates the app
 * publishes (sunrice/products/show.blade.php, …) are found first by
 * Sunrice and kept. With Brands off, brand term pages answer 404.
 */
final class TemplateFallback
{
    public const GENERIC = ['sunrice::defaults.show', 'sunrice::defaults.index', 'sunrice::defaults.term', 'sunrice.show', 'sunrice.index', 'sunrice.taxonomies.show'];

    public static function resolve(string $view, TemplateContext $context): ?string
    {
        // With Brands off, brand pages don't exist (published templates included).
        if ($context->pageType === 'term' && $context->taxonomy?->handle === config('commerce.catalog.brand_taxonomy') && ! commerce_feature('brands')) {
            abort(404);
        }
        if (! in_array($view, self::GENERIC, true)) {
            return null;
        }
        $collections = (array) config('commerce.catalog.collections', ['products']);

        return match ($context->pageType) {
            'entry' => in_array($context->collection?->handle, $collections, true) ? Layout::view('product') : null,
            'archive' => in_array($context->collection?->handle, $collections, true) ? Layout::view('shop') : null,
            'term' => match ($context->taxonomy?->handle) {
                config('commerce.catalog.category_taxonomy') => Layout::view('category'),
                config('commerce.catalog.brand_taxonomy') => Layout::view('brand'),
                config('commerce.catalog.tag_taxonomy') => Layout::view('tag'),
                default => null,
            },
            default => null,
        };
    }
}
