<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Symfony\Component\HttpFoundation\Response;

/** `commerce.auth`: signed-in customers only; guests go to the sign-in page and come back. */
class AuthenticateCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(commerce_feature('accounts'), 404);
        if (auth()->guard(CurrentCustomer::guard())->guest()) {
            if ($request->expectsJson()) {
                abort(401);
            }
            session()->put('url.intended', $request->fullUrl());

            return redirect(StorefrontRoutes::url('commerce.account.login'));
        }

        return $next($request);
    }
}
