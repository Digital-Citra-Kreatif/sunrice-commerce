<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Events\CartItemAdded;
use Sunrice\Commerce\Cart\Models\CartItem;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Features\Features;

/**
 * Adds a variant to the visitor's cart (or more of it), after checking it
 * can be bought. A line is a variant and its meta: the same variant with
 * other meta is a new line, and the purchasability check counts every line
 * of the variant. A new line is refused once the cart has commerce.cart.max_lines.
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
        $key = CartItem::lineKey($meta);
        $existing = $cart->items()->where('variant_id', $variant->id)->where('line_key', $key)->first();
        $max = (int) config('commerce.cart.max_lines', 500);
        if ($existing === null && $max > 0 && $cart->items()->count() >= $max) {
            throw new CartException(__('commerce::storefront.cart.full', ['count' => $max]), 'cart_full');
        }
        $total = ($existing->quantity ?? 0) + max(1, $quantity);
        // A first add of less than the minimum adds the minimum.
        $minimum = $variant->minOrderQuantity();
        if ($existing === null && $total < $minimum) {
            $total = $minimum;
        }

        $others = (int) $cart->items()->where('variant_id', $variant->id)->where('line_key', '!=', $key)->sum('quantity');
        $availability = $this->catalog->check($variant, $others + $total, commerce_customer());
        if (! $availability->isOk()) {
            throw new CartException($availability->message($this->title($variant)), (string) $availability->reason);
        }

        $item = $existing ?? new CartItem(['cart_id' => $cart->id, 'variant_id' => $variant->id, 'meta' => $meta !== [] ? $meta : null]);
        $item->fill(['quantity' => $total])->save();
        $cart->touchActivity();
        CartItemAdded::dispatch($item);

        return $item;
    }

    protected function title(Variant $variant): string
    {
        $title = (string) EntryTranslation::query()->where('entry_id', $variant->product->entry_id)
            ->whereIn('locale', [app()->getLocale(), Locales::default()])->orderByRaw('locale = ? desc', [app()->getLocale()])->value('title');

        return $variant->title !== '' ? "{$title} ({$variant->title})" : $title;
    }
}
