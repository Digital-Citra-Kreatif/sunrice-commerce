<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Listeners;

use Illuminate\Auth\Events\Login;
use Sunrice\Commerce\Cart\Actions\MergeCarts;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Wishlist\Wishlist;
use Sunrice\Commerce\Wishlist\WishlistManager;

/** At a storefront sign-in, the guest cart and wishlist join the customer's. */
class MergeOnSignIn
{
    public function handle(Login $event): void
    {
        if ($event->guard !== CurrentCustomer::guard()) {
            return;
        }
        $customer = Customer::forUser($event->user);
        if ($customer->locale === null) {
            $customer->forceFill(['locale' => app()->getLocale()])->save();
        }

        $token = request()->cookie((string) config('commerce.cart.cookie', 'commerce_cart'));
        if (is_string($token) && strlen($token) === 64) {
            $guest = Cart::query()->where('token', $token)->where('status', 'active')->where(fn ($q) => $q->whereNull('customer_id')->orWhere('customer_id', $customer->id))->first();
            if ($guest !== null) {
                $merge = app(MergeCarts::class);
                $cart = $merge->handle($guest, $customer);
                app(CartManager::class)->remember($cart);
                if ($merge->left > 0) {
                    session()->flash('commerce.error', __('commerce::storefront.cart.merge_full', ['count' => config('commerce.cart.max_lines'), 'left' => $merge->left]));
                }
            }
        }
        app(CartManager::class)->refresh();

        $wishlistToken = request()->cookie(WishlistManager::COOKIE);
        if (is_string($wishlistToken) && strlen($wishlistToken) === 64) {
            $guest = Wishlist::query()->where('token', $wishlistToken)->whereNull('customer_id')->first();
            if ($guest !== null) {
                app(WishlistManager::class)->merge($guest, $customer);
            }
        }
    }
}
