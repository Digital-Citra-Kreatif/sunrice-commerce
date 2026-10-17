<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Events\CartItemUpdated;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\Catalog;

/** Changes a line's quantity (0 removes it). */
class UpdateCartItem
{
    public function __construct(protected CartManager $carts, protected Catalog $catalog, protected RemoveCartItem $remove) {}

    public function handle(int $itemId, int $quantity): ?CartItem
    {
        $item = $this->item($itemId);
        if ($quantity <= 0) {
            $this->remove->handle($itemId);

            return null;
        }
        $availability = $this->catalog->check($item->variant->loadMissing('product'), $quantity, commerce_customer());
        if (! $availability->isOk()) {
            throw new CartException($availability->message(), (string) $availability->reason);
        }
        $item->forceFill(['quantity' => $quantity])->save();
        $item->cart->touchActivity();
        CartItemUpdated::dispatch($item);

        return $item;
    }

    protected function item(int $itemId): CartItem
    {
        $cart = $this->carts->current();
        $item = $cart?->items()->with('variant.product', 'cart')->find($itemId);
        if ($item === null) {
            throw new CartException(__('commerce::storefront.cart.not_in_cart'), 'not_found');
        }

        return $item;
    }
}
