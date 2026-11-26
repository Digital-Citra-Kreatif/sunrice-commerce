<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Listeners;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Sunrice\Account\Events\DeletionRequested;
use Sunrice\Account\Events\ProfileUpdated;
use Sunrice\Account\Events\Registered;
use Sunrice\Account\Events\SignedIn;
use Sunrice\Account\Profiles\Models\Profile;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Support\Phone;

/**
 * Keeps the store's customer record in step with its account: the name,
 * email, phone and language the person keeps on their profile, their
 * consent to marketing emails (given at registration or on the profile
 * page, nowhere in the store) and a request to be deleted. The account is
 * where they change; the customer record is what orders, audiences and
 * Shop → Customers read.
 */
class SyncCustomerFromAccount
{
    public function handle(Registered|ProfileUpdated|SignedIn|DeletionRequested $event): void
    {
        self::sync($event->user);
    }

    public static function sync(Authenticatable $user): Customer
    {
        $customer = Customer::forUser($user);
        if ($customer->anonymized_at !== null) {
            return $customer;
        }
        $profile = Profile::forUser($user);
        $name = $user instanceof Model ? $user->getAttribute('name') : null;
        $email = $user instanceof Model ? $user->getAttribute('email') : null;
        $email = is_string($email) ? mb_strtolower(trim($email)) : '';
        // The address follows the account's, unless another customer record already has it (one staff made for an
        // order): that one joins the account when it signs in with the address proven.
        $taken = $email === '' || $email === $customer->email || Customer::query()->where('email', $email)->whereKeyNot($customer->id)->exists();
        $customer->forceFill([
            'name' => is_string($name) && $name !== '' ? $name : $customer->name,
            'email' => $taken ? $customer->email : $email,
            // A phone given at checkout stays until the profile has one.
            'phone' => $profile->phone !== null && trim($profile->phone) !== '' ? Phone::normalize($profile->phone) : $customer->phone,
            'locale' => $profile->locale ?? $customer->locale,
            'accepts_marketing' => $profile->accepts_marketing,
            'marketing_consent_at' => $profile->accepts_marketing ? ($profile->marketing_consent_at ?? $customer->marketing_consent_at ?? now()) : null,
            'deletion_requested_at' => $profile->deletion_requested_at,
        ]);
        if ($customer->isDirty()) {
            $customer->save();
        }

        return $customer;
    }
}
