<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Sunrice\Commerce\Settings\StoreSettings;

class VerifiedAccountCheckout
{
    public function __construct(private StoreSettings $settings) {}

    public function required(): bool
    {
        return (bool) $this->settings->get('checkout.require_verified_account', false);
    }

    public function user(): (Model&Authenticatable)|null
    {
        $user = commerce_customer();

        return $user instanceof Model && $user->getAttribute('email_verified_at') !== null
            && filled($user->getAttribute('email')) ? $user : null;
    }
}
