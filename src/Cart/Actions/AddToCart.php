<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Events\CartItemAdded;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Features\Features;
use Sunrice\Models\EntryTranslation;
use Sunrice\Support\Locales;

/**
 * Adds a variant to the visitor's cart (or more of it), after checking it
 * can be bought. A new line is refused once the cart has commerce.cart.max_lines.
 */
class AddToCart
{
    public function __construct(protected CartManager $carts, protected Catalog $catalog, protected Features $features) {}

    /** @param  array<string, mixed>  $meta */
    public function handle(int $variantId, int $quantity = 1, array $meta = []): CartItem
    {
        if (! $this->features->active('cart')) {
            throw new CartException(__('commerce::storefront.availability.feature_off'), 'feature_off');
        }
        $variant = Variant::query()->with('product')->find($variantId);
        if ($variant === null) {
            throw new CartException(__('commerce::storefront.availability.not_published'), 'not_published');
        }
        $cart = $this->carts->current(create: true);
        $existing = $cart->items()->where('variant_id', $variant->id)->first();
        $max = (int) config('commerce.cart.max_lines', 100);
        if ($existing === null && $max > 0 && $cart->items()->count() >= $max) {
            throw new CartException(__('commerce::storefront.cart.full', ['count' => $max]), 'cart_full');
        }
        $total = ($existing->quantity ?? 0) + max(1, $quantity);
        // A first add of less than the minimum adds the minimum.
        if ($existing === null && $total < $variant->min_qty) {
            $total = $variant->min_qty;
        }

        $availability = $this->catalog->check($variant, $total, commerce_customer());
        if (! $availability->isOk()) {
            throw new CartException($availability->message($this->title($variant)), (string) $availability->reason);
        }

        $item = $existing ?? new CartItem(['cart_id' => $cart->id, 'variant_id' => $variant->id]);
        $item->fill(['quantity' => $total, 'meta' => $meta !== [] ? $meta : $item->meta])->save();
        $cart->touchActivity();
        CartItemAdded::dispatch($item);

        return $item;
    }

    protected function title(Variant $variant): string
    {
        $title = (string) EntryTranslation::query()->where('entry_id', $variant->product->entry_id)
            ->whereIn('locale', [app()->getLocale(), Locales::main()])->orderByRaw('locale = ? desc', [app()->getLocale()])->value('title');

        return $variant->title !== '' ? "{$title} ({$variant->title})" : $title;
    }
}
