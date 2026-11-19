<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

/**
 * The layout store pages extend: the site's (commerce.storefront.layout,
 * by default `cms.layout`, the CMS's site layout that its starter
 * templates and commerce's starter theme publish) when it exists, else
 * commerce's minimal one. Both take @section('content') and a `seoTitle`.
 */
final class Layout
{
    public static function name(): string
    {
        $layout = (string) config('commerce.storefront.layout', 'cms.layout');

        if ($layout !== '' && view()->exists($layout)) {
            return $layout;
        }

        return self::view('layouts.store');
    }

    /** The app's copy of a store view when it published one, else the package's. */
    public static function view(string $name): string
    {
        if (view()->exists("commerce.{$name}")) {
            return "commerce.{$name}";
        }

        return $name === 'layouts.store' ? 'commerce::layouts.store' : "commerce::storefront.{$name}";
    }

    /** Resolve published Commerce payment views and preserve third-party view names. */
    public static function paymentView(string $view): string
    {
        $prefix = 'commerce::storefront.payments.';

        return str_starts_with($view, $prefix) ? self::view('payments.'.substr($view, strlen($prefix))) : $view;
    }
}
