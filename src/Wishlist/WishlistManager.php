<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Wishlist;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Customer;

/**
 * The visitor's wishlist: a customer's, or a guest's (cookie
 * `commerce_wishlist`), merged into the customer's at sign-in. Shared
 * read-only by its share link.
 */
class WishlistManager
{
    public const COOKIE = 'commerce_wishlist';

    protected ?Wishlist $wishlist = null;

    public function current(bool $create = false): ?Wishlist
    {
        if ($this->wishlist !== null) {
            return $this->wishlist;
        }
        $user = commerce_customer();
        if ($user !== null) {
            $customer = Customer::forUser($user);
            $this->wishlist = Wishlist::query()->where('customer_id', $customer->id)->first()
                ?? ($create ? Wishlist::query()->create(['customer_id' => $customer->id, 'share_token' => Str::random(40)]) : null);

            return $this->wishlist;
        }
        $token = request()->cookie(self::COOKIE);
        if (is_string($token) && strlen($token) === 64) {
            $this->wishlist = Wishlist::query()->where('token', $token)->whereNull('customer_id')->first();
        }
        if ($this->wishlist === null && $create) {
            $this->wishlist = Wishlist::query()->create(['token' => Str::random(64), 'share_token' => Str::random(40)]);
            Cookie::queue(Cookie::make(self::COOKIE, (string) $this->wishlist->token, 60 * 24 * 365, httpOnly: true, sameSite: 'lax'));
        }

        return $this->wishlist;
    }

    public function add(int $productId, ?int $variantId = null): WishlistItem
    {
        $product = Product::query()->whereNull('removed_at')->find($productId);
        if ($product === null || ($variantId !== null && ! $product->variants()->whereKey($variantId)->exists())) {
            throw new CartException(__('commerce::storefront.availability.not_published'), 'not_published');
        }
        $wishlist = $this->current(create: true);
        $existing = $wishlist->items()->where('product_id', $productId)->where('variant_id', $variantId)->first();
        if ($existing !== null) {
            return $existing;
        }
        if ($wishlist->items()->count() >= Wishlist::LIMIT) {
            throw new CartException(__('commerce::storefront.wishlist.full', ['count' => Wishlist::LIMIT]), 'limit');
        }

        return $wishlist->items()->create(['product_id' => $productId, 'variant_id' => $variantId]);
    }

    public function remove(int $productId, ?int $variantId = null): void
    {
        $this->current()?->items()->where('product_id', $productId)->where('variant_id', $variantId)->delete();
    }

    public function has(int $productId): bool
    {
        return $this->current()?->items->contains('product_id', $productId) ?? false;
    }

    /** Turn the share link on or off; returns the wishlist. */
    public function share(bool $on): Wishlist
    {
        $wishlist = $this->current(create: true);
        $wishlist->forceFill(['is_shared' => $on])->save();

        return $wishlist;
    }

    /** At sign-in: the guest wishlist's items join the customer's (within the limit). */
    public function merge(Wishlist $guest, Customer $customer): Wishlist
    {
        $target = Wishlist::query()->where('customer_id', $customer->id)->first();
        if ($target === null) {
            $guest->forceFill(['customer_id' => $customer->id, 'token' => null])->save();

            return $guest;
        }
        DB::transaction(function () use ($guest, $target): void {
            $room = Wishlist::LIMIT - $target->items()->count();
            foreach ($guest->items()->get() as $item) {
                if ($room <= 0) {
                    break;
                }
                if (! $target->items()->where('product_id', $item->product_id)->where('variant_id', $item->variant_id)->exists()) {
                    $target->items()->create(['product_id' => $item->product_id, 'variant_id' => $item->variant_id]);
                    $room--;
                }
            }
            $guest->delete();
        });

        return $target;
    }
}
