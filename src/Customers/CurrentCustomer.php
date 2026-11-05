<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers;

use Illuminate\Contracts\Auth\Authenticatable;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Support\Staff;

/** The customer signed in to the storefront (null for guests, or while accounts are off). */
class CurrentCustomer
{
    protected ?Customer $customer = null;

    protected static bool $asGuest = false;

    public function __construct(protected Features $features) {}

    public function user(): ?Authenticatable
    {
        return $this->features->active('accounts') ? commerce_customer() : null;
    }

    public function get(): ?Customer
    {
        $user = $this->user();
        if ($user === null) {
            return null;
        }

        return $this->customer !== null && $this->customer->user_id === (int) $user->getAuthIdentifier()
            ? $this->customer
            : $this->customer = Customer::forUser($user);
    }

    /**
     * Run $callback as a guest sees the store (commerce_customer() is null
     * inside): for what is built once and shared, like the product feed.
     *
     * @template T
     *
     * @param  \Closure(): T  $callback
     * @return T
     */
    public static function asGuest(\Closure $callback): mixed
    {
        $was = self::$asGuest;
        self::$asGuest = true;
        try {
            return $callback();
        } finally {
            self::$asGuest = $was;
        }
    }

    public static function isGuestOnly(): bool
    {
        return self::$asGuest;
    }

    public static function guard(): string
    {
        return (string) config('commerce.auth.guard', 'commerce');
    }

    /** Whether the storefront shares the admin's guard (sign-ins by code or Google refuse staff then). */
    public static function sharesAdminGuard(): bool
    {
        return self::guard() === Staff::guard();
    }
}
