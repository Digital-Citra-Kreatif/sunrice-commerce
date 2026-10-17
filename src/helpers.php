<?php

declare(strict_types=1);

use Illuminate\Contracts\Auth\Authenticatable;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Models\Entry;

/*
 * Global helpers for templates. Each is wrapped in function_exists().
 */

if (! function_exists('commerce_money')) {
    /** An amount in minor units, formatted in the store currency: 150000 → "Rp150.000". */
    function commerce_money(int $amount, bool $withSymbol = true): string
    {
        return app(MoneyFormatter::class)->format($amount, $withSymbol);
    }
}

if (! function_exists('commerce_feature')) {
    /** Whether a store module is active (Settings → Store → Features). */
    function commerce_feature(string $feature): bool
    {
        return app(Features::class)->active($feature);
    }
}

if (! function_exists('commerce_url')) {
    /**
     * A store page's URL in the current language: commerce_url('commerce.cart')
     * gives /cart, or /en/cart on English pages.
     *
     * @param  array<string, mixed>  $parameters
     */
    function commerce_url(string $name, array $parameters = [], ?string $locale = null): string
    {
        return StorefrontRoutes::url($name, $parameters, $locale);
    }
}

if (! function_exists('commerce_customer')) {
    /** The customer signed in to the storefront (commerce guard), or null. */
    function commerce_customer(): ?Authenticatable
    {
        return auth()->guard((string) config('commerce.auth.guard', 'commerce'))->user();
    }
}

if (! function_exists('commerce_product')) {
    /** The product view of a product entry (price, stock, call-to-action, variants), or null. */
    function commerce_product(Entry|int $entry): ?ProductView
    {
        if (is_int($entry)) {
            $entry = Entry::query()->find($entry);
            if ($entry === null) {
                return null;
            }
        }

        return app(ProductViewFactory::class)->forEntry($entry);
    }
}
