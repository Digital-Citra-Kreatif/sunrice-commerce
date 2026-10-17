<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Illuminate\Contracts\Auth\Authenticatable;
use Spatie\Permission\Models\Role;
use Sunrice\Commerce\Settings\StoreSettings;

/** Gives a new customer the customer roles (Settings → Store → Accounts), on Sunrice's guard. */
class AssignCustomerRole
{
    public function handle(Authenticatable $user): void
    {
        if (! method_exists($user, 'assignRole')) {
            return;
        }
        $guard = (string) config('sunrice.auth.guard', 'web');
        foreach ((array) app(StoreSettings::class)->get('accounts.customer_roles', ['Customer']) as $role) {
            $user->assignRole(Role::findOrCreate((string) $role, $guard));
        }
    }
}
