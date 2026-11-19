<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Events\CartItemUpdated;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\Catalog;

/** Changes the quantity of a line that stays in the cart. */
class UpdateCartItem
{
    public function __construct(protected CartManager $carts, protected Catalog $catalog) {}

    public function handle(int $itemId, int $quantity): CartItem
    {
        if ($quantity < 1) {
            throw new CartException(__('commerce::storefront.cart.quantity_positive'), 'qty_rules');
        }

        $item = $this->item($itemId);
        // Other lines of the variant (with other meta) count too.
        $others = (int) $item->cart->items()->where('variant_id', $item->variant_id)->whereKeyNot($item->id)->sum('quantity');
        $availability = $this->catalog->check($item->variant->loadMissing('product'), $others + $quantity, commerce_customer());
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
