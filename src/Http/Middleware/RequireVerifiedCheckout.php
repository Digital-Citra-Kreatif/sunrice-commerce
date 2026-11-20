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
        $required = $this->checkout->codeRequired();
        if ($scope === 'access') {
            abort_unless($required, 404);
            // "Use another email": a guest starts over (a signed-in customer keeps their account's).
            if ($request->boolean('change') && commerce_customer() === null) {
                $request->session()->forget(VerifiedAccountCheckout::SESSION_EMAIL);
            }

            return $this->checkout->verifiedEmail() === null
                ? $next($request)
                : redirect(StorefrontRoutes::url('commerce.checkout'));
        }

        if (! $required) {
            return $next($request);
        }

        $email = $this->checkout->verifiedEmail();
        if ($email === null) {
            $url = StorefrontRoutes::url('commerce.checkout-access');

            return $request->expectsJson()
                ? response()->json(['message' => __('commerce::checkout-access.required'), 'redirect' => $url], 401)
                : redirect($url);
        }

        if (! $request->isMethodSafe()) {
            // The confirmed email is the order's; a verified account needs no new one.
            $request->merge($this->checkout->required() ? ['email' => $email, 'create_account' => false] : ['email' => $email]);
        }

        return $next($request);
    }
}
