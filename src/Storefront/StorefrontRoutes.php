<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Closure;
use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Http\Middleware\ForgetLocaleParameter;
use Sunrice\Commerce\Http\Middleware\SetStoreLocale;
use Sunrice\Cms\Support\Locales;

/**
 * Registers store routes in the visitor's language, like the CMS's own
 * pages: once without a prefix (the language at the plain addresses) and
 * once under /{locale} for the others (their address segments). The closure receives the route-name suffix
 * ('' or '.locale'):
 *
 *     StorefrontRoutes::localized(function (string $suffix) {
 *         Route::get('cart', CartController::class)->name('commerce.cart'.$suffix);
 *     });
 */
final class StorefrontRoutes
{
    public const LOCALE_SUFFIX = '.locale';

    /** @param  Closure(string): void  $routes */
    public static function localized(Closure $routes): void
    {
        $middleware = ['web', SetStoreLocale::class, ForgetLocaleParameter::class];

        Route::middleware($middleware)->group(fn () => $routes(''));

        // Each other language under its address segment (Settings → Languages: by default its code).
        $others = array_values(array_filter(Locales::segments(), fn (string $segment) => $segment !== ''));
        if ($others !== []) {
            Route::middleware($middleware)
                ->prefix('{locale}')
                ->where(['locale' => '(?:'.implode('|', array_map('preg_quote', $others)).')'])
                ->group(fn () => $routes(self::LOCALE_SUFFIX));
        }
    }

    /**
     * A store URL in the current (or given) language: commerce_url('commerce.cart').
     *
     * @param  array<string, mixed>  $parameters
     */
    public static function url(string $name, array $parameters = [], ?string $locale = null, bool $absolute = true): string
    {
        $locale ??= app()->getLocale();
        $segment = Locales::has($locale) ? (Locales::segments()[$locale] ?? $locale) : '';
        if ($segment !== '' && Route::has($name.self::LOCALE_SUFFIX)) {
            return route($name.self::LOCALE_SUFFIX, ['locale' => $segment, ...$parameters], $absolute);
        }

        return route($name, $parameters, $absolute);
    }

    /** A configured store path: StorefrontRoutes::path('cart') → "cart". */
    public static function path(string $key): string
    {
        return trim((string) config("commerce.storefront.paths.{$key}", $key), '/');
    }
}
