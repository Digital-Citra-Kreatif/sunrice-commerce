<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health\Checks;

use Sunrice\Commerce\Customers\Auth\LoginCodes;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Health\HealthCheck;
use Sunrice\Commerce\Health\HealthResult;
use Sunrice\Commerce\Http\Controllers\Account\GoogleController;

/** Passwordless sign-in needs the HasOneTimePasswords trait; Google sign-in needs its keys. */
class AccountsCheck implements HealthCheck
{
    public function key(): string
    {
        return 'accounts';
    }

    public function label(): string
    {
        return 'Customer sign-in';
    }

    public function run(): HealthResult
    {
        $features = app(Features::class);
        if ($features->active('passwordless_login') && ! app(LoginCodes::class)->supported()) {
            return HealthResult::error('Sign-in with an emailed code is on, but the user model lacks the HasOneTimePasswords trait.', 'Run php artisan commerce:install, or add Spatie\\OneTimePasswords\\Models\\Concerns\\HasOneTimePasswords to the user model.');
        }
        if ($features->active('google_login') && ! GoogleController::configured()) {
            return HealthResult::error('Sign in with Google is on, but GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set.', 'Add them to .env (services.google), or switch Google sign-in off.');
        }

        return HealthResult::ok('Customer sign-in is ready.');
    }
}
