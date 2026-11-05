<?php

declare(strict_types=1);

use Illuminate\Contracts\Auth\Authenticatable;
use Sunrice\Commerce\Catalog\ProductView;
use Sunrice\Commerce\Catalog\ProductViewFactory;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Models\Term;
use Sunrice\Cms\Models\TermTranslation;

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
    /** The product view of a product entry (price, stock, call-to-action, variants), or null: the `$entry` of a template, an Entry or its id. */
    function commerce_product(Entry|EntryTranslation|int $entry): ?ProductView
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

if (! function_exists('commerce_store_name')) {
    /** The store's name (Settings → Store → General), or the app's. */
    function commerce_store_name(): string
    {
        return (string) (app(StoreSettings::class)->get('general.name') ?: config('app.name'));
    }
}

if (! function_exists('commerce_values')) {
    /**
     * An entry's or term's fields as templates get them (the CMS's
     * values()), worked out once per request for each: `commerce_values($entry)['excerpt'] ?? null`.
     *
     * @return array<mixed>
     */
    function commerce_values(EntryTranslation|Term|TermTranslation $item): array
    {
        /** @var WeakMap<object, array<mixed>> $memo */
        static $memo = new WeakMap;

        if (! isset($memo[$item]) && $item instanceof Term) {
            // Its translation knows its term (and so its taxonomy): no queries to find them again.
            $memo[$item] = $item->translation()?->setRelation('term', $item)->values() ?? [];
        }

        return $memo[$item] ??= $item->values();
    }
}

if (! function_exists('commerce_body_classes')) {
    /**
     * The store's classes for the <body> of its own pages (cart, checkout,
     * account…): `page-commerce commerce-cart`. Layouts add them with
     * `@bodyClass(commerce_body_classes())`; elsewhere, none.
     *
     * @return list<string>
     */
    function commerce_body_classes(): array
    {
        $name = (string) request()->route()?->getName();
        if (! str_starts_with($name, 'commerce.') || str_starts_with($name, 'commerce.api.')) {
            return [];
        }

        return ['page-commerce', 'commerce-'.str_replace('.', '-', substr(preg_replace('/\.locale$/', '', $name) ?? $name, strlen('commerce.')))];
    }
}
