<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\User;
use Sunrice\Commerce\Customers\Actions\AssignCustomerRole;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Customers\Auth\LoginCodes;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\WelcomeCustomer;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Throwable;

/**
 * Sign in with Google: an existing link signs in; a verified Google email
 * matching an account links it; otherwise an account is created when
 * registration is open.
 */
class GoogleController
{
    /** Google's driver, with the one fixed callback URL. */
    protected static function driver(): Provider
    {
        $driver = Socialite::driver('google');
        if ($driver instanceof AbstractProvider) {
            $driver->redirectUrl(route('commerce.account.google.callback'));
        }

        return $driver;
    }

    public static function configured(): bool
    {
        return filled(config('services.google.client_id')) && filled(config('services.google.client_secret'));
    }

    public function redirect(Request $request): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        abort_unless(commerce_feature('google_login') && static::configured(), 404);
        $request->session()->put('commerce.google_locale', app()->getLocale());

        return static::driver()->redirect();
    }

    public function callback(Request $request, StoreSettings $settings, AssignCustomerRole $roles, LinkGuestOrders $link): RedirectResponse
    {
        abort_unless(commerce_feature('google_login') && static::configured(), 404);
        $locale = (string) $request->session()->pull('commerce.google_locale', app()->getLocale());
        $login = StorefrontRoutes::url('commerce.account.login', [], $locale);
        try {
            $google = static::driver()->user();
        } catch (Throwable) {
            return redirect($login)->with('commerce.error', __('commerce::account.google.failed', [], $locale));
        }
        $model = config('sunrice.auth.user_model');
        $accounts = DB::table('commerce_social_accounts');

        $linked = $accounts->clone()->where('provider', 'google')->where('provider_id', (string) $google->getId())->value('user_id');
        $user = $linked !== null ? $model::query()->find($linked) : null;
        $email = mb_strtolower((string) $google->getEmail());
        $verified = $google instanceof User && (bool) ($google->getRaw()['email_verified'] ?? false);

        if ($user === null && $email !== '' && $verified) {
            $user = $model::query()->where('email', $email)->first();
        }
        if ($user === null) {
            if (! $settings->get('accounts.registration', true) || $email === '' || ! $verified) {
                return redirect($login)->with('commerce.error', __('commerce::account.google.no_account', [], $locale));
            }
            $user = $model::query()->create(['name' => (string) ($google->getName() ?: Str::before($email, '@')), 'email' => $email, 'password' => Hash::make(Str::random(40))]);
            $user->forceFill(['email_verified_at' => now()])->save();
            $roles->handle($user);
            Customer::forUser($user)->forceFill(['meta' => ['password_set' => false]])->save();
            $user->notify(new WelcomeCustomer($locale));
        }
        if (LoginCodes::isRefusedStaff($user)) {
            return redirect($login)->with('commerce.error', __('commerce::account.staff_refused', [], $locale));
        }
        if ($linked === null) {
            $accounts->clone()->insert(['user_id' => $user->getKey(), 'provider' => 'google', 'provider_id' => (string) $google->getId(),
                'email' => $email, 'avatar' => $google->getAvatar(), 'created_at' => now(), 'updated_at' => now()]);
        }
        if ($user->getAttribute('email_verified_at') === null && $verified) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }
        Customer::forUser($user);
        Auth::guard(CurrentCustomer::guard())->login($user, true);
        $request->session()->regenerate();
        $link->handle($user);

        return redirect()->intended(StorefrontRoutes::url('commerce.account', [], $locale));
    }
}
