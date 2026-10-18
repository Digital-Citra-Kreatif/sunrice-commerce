<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Wishlist\Wishlist;

/**
 * Removes a customer's personal data (a deletion request, or the right
 * to be forgotten): name, email and phone become placeholders on the
 * customer, the user (who can no longer sign in) and order snapshots;
 * addresses, wishlists, sign-in codes and social links are deleted. Money
 * columns and order items are kept.
 */
class AnonymizeCustomer
{
    /**
     * Order snapshot columns cleared by later modules (orders add theirs).
     *
     * @var array<int, \Closure(Customer, string): void>
     */
    protected static array $orderScrubbers = [];

    /** @param  \Closure(Customer, string): void  $scrubber */
    public static function scrubOrdersUsing(\Closure $scrubber): void
    {
        static::$orderScrubbers[] = $scrubber;
    }

    public function handle(Customer $customer): void
    {
        $placeholder = 'deleted-'.$customer->id.'-'.Str::lower(Str::random(6)).'@invalid.local';
        DB::transaction(function () use ($customer, $placeholder): void {
            $user = $customer->user();
            if ($user !== null) {
                $user->forceFill(['name' => 'Deleted customer', 'email' => $placeholder, 'password' => Hash::make(Str::random(64)), 'remember_token' => null])->save();
                if (method_exists($user, 'syncRoles')) {
                    $user->syncRoles([]);
                }
                DB::table('commerce_social_accounts')->where('user_id', $user->getAuthIdentifier())->delete();
                if (Schema::hasTable('one_time_passwords')) {
                    DB::table('one_time_passwords')->where('authenticatable_id', $user->getAuthIdentifier())->where('authenticatable_type', $user->getMorphClass())->delete();
                }
            }
            $customer->addresses()->delete();
            Wishlist::query()->where('customer_id', $customer->id)->delete();
            DB::table('commerce_voucher_customers')->where('customer_id', $customer->id)->orWhere('email', $customer->email)->delete();
            // Orders keep their amounts for the books, without the person.
            $scrubbed = ['customer_name' => 'Deleted customer', 'email' => $placeholder, 'phone' => null, 'shipping_address' => null, 'billing_address' => null,
                'dropship' => null, 'fields' => null, 'customer_note' => null, 'ip_address' => null, 'user_agent' => null];
            DB::table('commerce_orders')->where('customer_id', $customer->id)
                ->when($user !== null, fn ($q) => $q->orWhere('user_id', $user->getAuthIdentifier()))
                ->update([...$scrubbed, 'updated_at' => now()]);
            DB::table('commerce_payment_confirmations')->where('customer_id', $customer->id)->update(['sender_name' => 'Deleted customer', 'note' => null, 'ip_address' => null]);
            // Marketing emails sent to them (the campaigns keep their totals).
            DB::table('commerce_campaign_sends')->where('customer_id', $customer->id)->orWhere('email', $customer->email)->delete();
            foreach (static::$orderScrubbers as $scrub) {
                $scrub($customer, $placeholder);
            }
            $customer->forceFill(['name' => null, 'email' => $placeholder, 'phone' => null, 'note' => null, 'meta' => null,
                'accepts_marketing' => false, 'marketing_consent_at' => null, 'anonymized_at' => now()])->save();
        });
        app(ActivityRecorder::class)->record('anonymized', "Customer #{$customer->id}", [], 'customer');
    }
}
