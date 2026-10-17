<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Private store pages (cart, checkout, account…) stay out of search engines. */
class NoIndex
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->attributes->set('commerce.noindex', true);
        $response = $next($request);
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        return $response;
    }
}
