<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sunrice\Cms\Support\Locales;
use Symfony\Component\HttpFoundation\Response;

/**
 * Store pages are in the language of their address, as the CMS's pages
 * are: /en/cart in English, /cart in the language at the plain addresses.
 */
class SetStoreLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        [$locale] = Locales::split($request->path());
        app()->setLocale($locale);

        return $next($request);
    }
}
