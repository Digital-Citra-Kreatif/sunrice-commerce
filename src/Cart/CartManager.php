<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * The visitor's cart: a signed-in customer's active cart, or the guest
 * cart of the `commerce_cart` cookie (created on the first write).
 */
class CartManager
{
    protected ?Cart $cart = null;

    protected bool $resolved = false;

    public function current(bool $create = false): ?Cart
    {
        if (! $this->resolved || ($create && $this->cart === null)) {
            $this->cart = $this->find() ?? ($create ? $this->create() : null);
            $this->resolved = true;
        }

        return $this->cart;
    }

    public function customer(): ?Customer
    {
        $user = commerce_customer();

        return $user === null ? null : Customer::forUser($user);
    }

    protected function find(): ?Cart
    {
        $customer = commerce_customer() !== null ? $this->customer() : null;
        if ($customer !== null) {
            $cart = Cart::query()->where('customer_id', $customer->id)->where('status', 'active')->latest('id')->first();
            if ($cart !== null) {
                return $cart;
            }
        }
        $token = request()->cookie($this->cookieName());
        if (! is_string($token) || strlen($token) !== 64) {
            return null;
        }
        $cart = Cart::query()->where('token', $token)->where('status', 'active')->first();
        // A guest cart found after signing in becomes the customer's.
        if ($cart !== null && $customer !== null && $cart->customer_id === null) {
            $cart->forceFill(['customer_id' => $customer->id])->save();
        }

        return $cart;
    }

    protected function create(): Cart
    {
        $cart = Cart::query()->create([
            'token' => Str::random(64),
            'customer_id' => $this->customer()?->id,
            'currency' => (string) app(StoreSettings::class)->get('general.currency.code', 'IDR'),
            'locale' => app()->getLocale(),
            'status' => 'active',
            'last_activity_at' => now(),
        ]);
        $this->remember($cart);

        return $cart;
    }

    /** Keep this cart for the visitor (cookie for guests). */
    public function remember(Cart $cart): void
    {
        $this->cart = $cart;
        $this->resolved = true;
        Cookie::queue(Cookie::make($this->cookieName(), $cart->token, (int) config('commerce.cart.lifetime_days', 30) * 1440, httpOnly: true, sameSite: 'lax'));
    }

    public function forget(): void
    {
        $this->cart = null;
        $this->resolved = true;
        Cookie::queue(Cookie::forget($this->cookieName()));
    }

    /** Forget what this request knows (after sign-in or out). */
    public function refresh(): void
    {
        $this->cart = null;
        $this->resolved = false;
    }

    public function cookieName(): string
    {
        return (string) config('commerce.cart.cookie', 'commerce_cart');
    }
}
