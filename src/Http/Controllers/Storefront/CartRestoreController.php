<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Marketing\Models\CampaignSend;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * {cart_url} in an abandoned-cart email: brings that cart back on this
 * browser (a guest's cart cookie; a customer's cart is found again when
 * they sign in) and opens the cart page.
 */
class CartRestoreController extends Controller
{
    public function __invoke(string $token, CartManager $carts): RedirectResponse
    {
        $send = strlen($token) === 40 ? CampaignSend::query()->where('token', $token)->where('status', 'sent')->first() : null;
        $cartId = (array) ($send->context ?? []);
        $cart = isset($cartId['cart_id']) ? Cart::query()->whereKey((int) $cartId['cart_id'])->where('status', 'active')->first() : null;
        if ($cart !== null && $cart->customer_id === null) {
            $carts->remember($cart);
        }

        return redirect()->to(StorefrontRoutes::url('commerce.cart'));
    }
}
