<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Sunrice\Commerce\Cart\Models\Cart;

/** Stores what the customer entered at checkout (contact, addresses, choices) on the cart. */
class UpdateCheckoutData
{
    /** @param  array<string, mixed>  $data */
    public function handle(Cart $cart, array $data): Cart
    {
        $cart->checkout = array_replace((array) $cart->checkout, $data);
        $cart->save();
        $cart->touchActivity();

        return $cart;
    }
}
