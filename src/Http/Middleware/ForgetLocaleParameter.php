<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Store routes in other languages live under /{locale}; the language is
 * already set (SetFrontendLocale), so controllers don't get it as a
 * parameter.
 */
class ForgetLocaleParameter
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->route()?->forgetParameter('locale');

        return $next($request);
    }
}
