<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers;

use Illuminate\Contracts\Auth\Authenticatable;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Features\Features;

/** The customer signed in to the storefront (null for guests, or while accounts are off). */
class CurrentCustomer
{
    protected ?Customer $customer = null;

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

    public static function guard(): string
    {
        return (string) config('commerce.auth.guard', 'commerce');
    }

    /** Whether the storefront shares the admin's guard (sign-ins by code or Google refuse staff then). */
    public static function sharesAdminGuard(): bool
    {
        return self::guard() === (string) config('sunrice.auth.guard', 'web');
    }
}
