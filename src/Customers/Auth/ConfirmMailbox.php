<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Sunrice\Commerce\Customers\Models\Customer;

/**
 * Verifies an account because its mailbox was just proven (a sign-in code,
 * a checkout code, Google), not its password.
 *
 * Whoever registered an unverified account chose its password, and that
 * needn't be the mailbox's owner: anyone can register someone else's
 * address and wait for them to sign in another way. So the password set
 * before the proof is dropped, with the remembered sessions: the owner
 * sets a new one from My Account, without the current one.
 *
 * Staff accounts are made by an administrator, never by registration:
 * theirs is kept.
 */
class ConfirmMailbox
{
    /** Whether the account was unverified until now. */
    public function handle(Authenticatable $user): bool
    {
        if ($user->getAttribute('email_verified_at') !== null) {
            return false;
        }
        $staff = method_exists($user, 'can') && $user->can('sunrice.access');
        $user->forceFill([
            'email_verified_at' => now(),
            ...($staff ? [] : ['password' => Hash::make(Str::random(64))]),
        ]);
        if (! $staff) {
            $user->setRememberToken(Str::random(60));
        }
        $user->save();
        if (! $staff) {
            $customer = Customer::forUser($user);
            $customer->forceFill(['meta' => [...(array) $customer->meta, 'password_set' => false]])->save();
        }

        return true;
    }
}
