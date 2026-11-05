<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Sunrice\Admin\Panel;

/**
 * The app's user model and the panel's guard. Staff and customers are both
 * rows of that model: staff sign in to the panel's guard, customers to
 * the store's own (commerce.auth.guard), on the same user provider.
 */
final class Staff
{
    /**
     * The panel's user model: an Eloquent model that signs in (and, with
     * spatie/laravel-permission's HasRoles, has roles).
     *
     * @return class-string<Model&Authenticatable>
     */
    public static function userModel(): string
    {
        $model = app(Panel::class)->getUserModel();
        if (! is_a($model, Authenticatable::class, true)) {
            throw new \LogicException("The panel's user model ({$model}) isn't Authenticatable.");
        }

        return $model;
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
