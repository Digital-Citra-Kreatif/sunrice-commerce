<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Database\Eloquent\Builder;
use Sunrice\Admin\Users\UserResource;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Administration → Users with staff only: users whose roles are all
 * customer roles (Settings → Store → Accounts) are customers, listed in
 * Shop → Customers instead. The app's panel provider uses it:
 *
 *     $panel->userResource(StaffUserResource::class)->plugin(CmsPlugin::make())->plugin(CommercePlugin::make());
 */
class StaffUserResource extends UserResource
{
    public static function query(): Builder
    {
        $customerRoles = (array) app(StoreSettings::class)->get('accounts.customer_roles', ['Customer']);

        return parent::query()->where(fn (Builder $q) => $q->whereDoesntHave('roles')
            ->orWhereHas('roles', fn (Builder $r) => $r->whereNotIn('name', $customerRoles)));
    }
}
