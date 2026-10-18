<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Events\CartItemRemoved;

class RemoveCartItem
{
    public function __construct(protected CartManager $carts) {}

    public function handle(int $itemId): void
    {
        $cart = $this->carts->current();
        $item = $cart?->items()->find($itemId);
        if ($item === null) {
            throw new CartException(__('commerce::storefront.cart.not_in_cart'), 'not_found');
        }
        $item->delete();
        $cart->touchActivity();
        CartItemRemoved::dispatch($item);
    }
}
