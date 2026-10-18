<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Spatie\OneTimePasswords\Enums\ConsumeOneTimePasswordResult;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Notifications\CustomerLoginCode;
use Sunrice\Commerce\Customers\Notifications\WelcomeCustomer;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * One-time sign-in codes (ARCHITECTURE.md §16.2), with
 * spatie/laravel-one-time-passwords. Signs in on the commerce guard only:
 * the package's attemptLoginUsingOneTimePassword() (default guard) is
 * never used.
 */
class LoginCodes
{
    public function __construct(protected StoreSettings $settings) {}

    public function supported(): bool
    {
        $model = config('sunrice.auth.user_model');

        return is_string($model) && method_exists($model, 'createOneTimePassword');
    }

    /** Creates and emails a code (replacing an earlier one). */
    public function request(Authenticatable $user): void
    {
        $code = $user->createOneTimePassword((int) $this->settings->get('accounts.code_minutes', 10));
        $user->notify(new CustomerLoginCode($code, app()->getLocale()));
    }

    /** The message key of a failure, or null when signed in. */
    public function consume(Authenticatable $user, string $code, bool $remember = false): ?string
    {
        $result = $user->consumeOneTimePassword($code);
        if (! $result->isOk()) {
            return match ($result) {
                ConsumeOneTimePasswordResult::OneTimePasswordExpired => 'expired',
                ConsumeOneTimePasswordResult::DifferentOrigin => 'different_origin',
                ConsumeOneTimePasswordResult::RateLimitExceeded => 'rate_limited',
                ConsumeOneTimePasswordResult::NoOneTimePasswordsFound => 'none',
                default => 'incorrect',
            };
        }
        // The first code proves the address: like the verification link, it welcomes the new account.
        if ($user->getAttribute('email_verified_at') === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
            if (method_exists($user, 'notify')) {
                $user->notify(new WelcomeCustomer(app()->getLocale()));
            }
        }
        Auth::guard(CurrentCustomer::guard())->login($user, $remember);
        app(LinkGuestOrders::class)->handle($user);

        return null;
    }

    /** In shared-guard mode, staff can't sign in by code or Google (their admin must stay password-protected). */
    public static function isRefusedStaff(Authenticatable $user): bool
    {
        return CurrentCustomer::sharesAdminGuard() && method_exists($user, 'can') && $user->can('sunrice.access-admin');
    }
}
