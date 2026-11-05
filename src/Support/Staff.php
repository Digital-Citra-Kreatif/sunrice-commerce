<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Illuminate\Database\Eloquent\Model;
use Sunrice\Admin\Panel;

/**
 * The app's user model and the panel's guard. Staff and customers are both
 * rows of that model: staff sign in to the panel's guard, customers to
 * the store's own (commerce.auth.guard), on the same user provider.
 */
final class Staff
{
    /** @return class-string<Model> */
    public static function userModel(): string
    {
        return app(Panel::class)->getUserModel();
    }

    public static function guard(): string
    {
        return app(Panel::class)->getGuard();
    }

    public static function superAdminRole(): string
    {
        return (string) config('sunrice-admin.super_admin_role', 'super-admin');
    }
}
