<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

/**
 * The layout store pages extend: the site's (commerce.storefront.layout,
 * Sunrice's starter layout by default) when it exists, else commerce's
 * minimal one. Both take @section('content') and a `seoTitle`.
 */
final class Layout
{
    public static function name(): string
    {
        $layout = (string) config('commerce.storefront.layout', 'sunrice.layouts.app');

        return $layout !== '' && view()->exists($layout) ? $layout : 'commerce::layouts.store';
    }

    /** The app's copy of a store view when it published one, else the package's. */
    public static function view(string $name): string
    {
        return view()->exists("commerce.{$name}") ? "commerce.{$name}" : "commerce::storefront.{$name}";
    }
}
