<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Sunrice\Account\Account;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * {cart_url} in an abandoned-cart email: opens the cart page of the account
 * the email went to. A cart is its account's, found again by signing in:
 * the link never hands one to whoever holds it, so a visitor is sent to
 * sign in first and comes back to the cart.
 */
class CartRestoreController extends Controller
{
    public function __invoke(string $token): RedirectResponse
    {
        $cart = StorefrontRoutes::url('commerce.cart');

        return commerce_customer() === null ? app(Account::class)->redirectToSignIn($cart) : redirect()->to($cart);
    }
}
