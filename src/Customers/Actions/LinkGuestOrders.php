<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Sunrice\Commerce\Checkout\Actions\ResolveCheckoutSession;
use Sunrice\Commerce\Checkout\VerifiedAccountCheckout;
use Sunrice\Commerce\Customers\Models\Customer;

/** After an email is verified: earlier guest orders with that email join the account. */
class LinkGuestOrders
{
    public function handle(Authenticatable $user): int
    {
        if (app(VerifiedAccountCheckout::class)->required() || ! Schema::hasTable('commerce_orders')) {
            return 0;
        }
        $customer = Customer::forUser($user);

        return DB::table('commerce_orders')->where('type', '!=', ResolveCheckoutSession::TYPE)->whereNull('user_id')->where('email', $customer->email)
            ->update(['user_id' => (int) $user->getAuthIdentifier(), 'customer_id' => $customer->id]);
    }
}
