<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Actions;

use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;

/** The customer chooses whether the cart is paid with their loyalty points (kept on the cart until checkout). */
class UsePoints
{
    public function __construct(protected CartManager $carts) {}

    public function handle(bool $use): void
    {
        $cart = $this->carts->current();
        if ($cart === null || commerce_customer() === null) {
            throw new CartException(__('commerce::storefront.cart.empty'), 'empty');
        }
        $cart->checkout = [...(array) $cart->checkout, 'use_points' => $use];
        $cart->save();
    }
}
