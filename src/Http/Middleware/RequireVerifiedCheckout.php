<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sunrice\Commerce\Checkout\VerifiedAccountCheckout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Symfony\Component\HttpFoundation\Response;

class RequireVerifiedCheckout
{
    public function __construct(private VerifiedAccountCheckout $checkout) {}

    public function handle(Request $request, Closure $next, string $scope = 'checkout'): Response
    {
        $required = $this->checkout->required();
        if ($scope === 'access') {
            abort_unless($required, 404);

            return $this->checkout->user() === null
                ? $next($request)
                : redirect(StorefrontRoutes::url('commerce.checkout'));
        }

        if (! $required) {
            return $next($request);
        }

        $user = $this->checkout->user();
        if ($user === null) {
            $url = StorefrontRoutes::url('commerce.checkout-access');

            return $request->expectsJson()
                ? response()->json(['message' => __('commerce::checkout-access.required'), 'redirect' => $url], 401)
                : redirect($url);
        }

        if (! $request->isMethodSafe()) {
            $request->merge(['email' => $user->getAttribute('email'), 'create_account' => false]);
        }

        return $next($request);
    }
}
