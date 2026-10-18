<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Sunrice\Auth\TwoFactorLogin;
use Sunrice\Commerce\Checkout\TermsPage;
use Sunrice\Commerce\Customers\Actions\AssignCustomerRole;
use Sunrice\Commerce\Customers\Actions\LinkGuestOrders;
use Sunrice\Commerce\Customers\Auth\LoginCodes;
use Sunrice\Commerce\Customers\Auth\Throttle;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Customers\Notifications\CustomerResetPassword;
use Sunrice\Commerce\Customers\Notifications\VerifyCustomerEmail;
use Sunrice\Commerce\Customers\Notifications\WelcomeCustomer;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Support\Phone;
use Sunrice\Support\Captcha;

/**
 * Storefront sign-in with a password, registration, password reset and
 * email verification, on the commerce guard (never the admin's).
 */
class AuthController
{
    // Per request (the router keeps controller instances).
    protected StoreSettings $settings {
        get => app(StoreSettings::class);
    }

    public function showLogin(): View|RedirectResponse
    {
        if ($this->guard()->check()) {
            return redirect(StorefrontRoutes::url('commerce.account'));
        }

        return view(Layout::view('account.login'), ['seoTitle' => __('commerce::account.login.title')]);
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate(['email' => ['required', 'string', 'email', 'max:190'], 'password' => ['required', 'string', 'max:200']]);
        Throttle::check('commerce-login', $request, $data['email'], 5, 30);

        $user = $this->users()::query()->where('email', mb_strtolower($data['email']))->first();
        if ($user === null || $user->getAuthPassword() === '' || ! Hash::check($data['password'], $user->getAuthPassword())) {
            Throttle::hit('commerce-login', $request, $data['email']);
            throw ValidationException::withMessages(['email' => __('commerce::account.login.failed')]);
        }
        // Sharing the admin's session, the storefront would skip the admin's two-factor step.
        if (TwoFactorLogin::enabled() && LoginCodes::isRefusedStaff($user)) {
            throw ValidationException::withMessages(['email' => __('commerce::account.staff_two_factor')]);
        }
        if ($this->settings->get('accounts.verify_email', true) && $user->getAttribute('email_verified_at') === null) {
            $user->notify(new VerifyCustomerEmail(app()->getLocale()));
            throw ValidationException::withMessages(['email' => __('commerce::account.verify.required')]);
        }
        Throttle::clear('commerce-login', $request, $data['email']);
        $this->guard()->login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(StorefrontRoutes::url('commerce.account'));
    }

    /** Signs out of the storefront only: the admin session and the cart stay. */
    public function logout(Request $request): RedirectResponse
    {
        $this->guard()->logout();
        $request->session()->regenerate();
        $request->session()->regenerateToken();

        return redirect(url('/'));
    }

    public function showRegister(): View
    {
        abort_unless($this->settings->get('accounts.registration', true), 404);

        return view(Layout::view('account.register'), [
            'seoTitle' => __('commerce::account.register.title'),
            'termsUrl' => TermsPage::url(),
            'captcha' => Captcha::widget(app()->getLocale()),
        ]);
    }

    public function register(Request $request, AssignCustomerRole $roles): RedirectResponse
    {
        abort_unless($this->settings->get('accounts.registration', true), 404);
        $passwordless = commerce_feature('passwordless_login') && $request->boolean('passwordless');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:190'],
            'phone' => [$this->settings->get('accounts.require_phone') ? 'required' : 'nullable', 'string', 'max:30'],
            'password' => $passwordless ? ['nullable'] : ['required', 'confirmed', PasswordRule::min(8)],
            'accepts_marketing' => ['nullable', 'boolean'],
            'terms' => $this->settings->get('checkout.terms_page') ? ['accepted'] : ['nullable'],
        ]);
        if (($field = Captcha::field()) !== null && ! Captcha::verify((string) $request->input($field), $request->ip())) {
            return back()->withInput($request->except(['password', 'password_confirmation']))->withErrors(['captcha' => __('commerce::payments.confirm.captcha')]);
        }
        Throttle::check('commerce-register', $request, '', 100, 5, 3600);
        Throttle::hit('commerce-register', $request, '', 3600);

        $email = mb_strtolower($data['email']);
        $existing = $this->users()::query()->where('email', $email)->first();
        if ($existing !== null) {
            // No account enumeration: the owner is told by email instead.
            if ($existing->getAttribute('email_verified_at') === null) {
                $existing->notify(new VerifyCustomerEmail(app()->getLocale()));
            }

            return redirect(StorefrontRoutes::url('commerce.account.login'))->with('commerce.success', __('commerce::account.register.check_email'));
        }

        $phone = isset($data['phone']) ? Phone::normalize($data['phone']) : null;
        $user = $this->users()::query()->create([
            'name' => $data['name'],
            'email' => $email,
            'password' => $passwordless ? Hash::make(Str::random(40)) : $data['password'],
        ]);
        $roles->handle($user);
        $customer = Customer::forUser($user);
        $customer->forceFill(['phone' => $phone, 'name' => $data['name'], 'locale' => app()->getLocale(),
            'accepts_marketing' => (bool) ($data['accepts_marketing'] ?? false), 'marketing_consent_at' => ($data['accepts_marketing'] ?? false) ? now() : null,
            'meta' => $passwordless ? ['password_set' => false] : null])->save();
        event(new Registered($user));

        if ($passwordless) {
            return app(LoginCodeController::class)->send($request->merge(['email' => $email]), app(LoginCodes::class));
        }
        if ($this->settings->get('accounts.verify_email', true)) {
            $user->notify(new VerifyCustomerEmail(app()->getLocale()));

            return redirect(StorefrontRoutes::url('commerce.account.login'))->with('commerce.success', __('commerce::account.register.check_email'));
        }
        $user->notify(new WelcomeCustomer(app()->getLocale()));
        $this->guard()->login($user);
        $request->session()->regenerate();

        return redirect(StorefrontRoutes::url('commerce.account'))->with('commerce.success', __('commerce::account.register.welcome'));
    }

    public function verify(Request $request, int $id, string $hash, LinkGuestOrders $link): RedirectResponse
    {
        abort_unless($request->hasValidSignature(), 403);
        $user = $this->users()::query()->findOrFail($id);
        abort_unless(hash_equals(sha1((string) $user->getAttribute('email')), $hash), 403);
        $locale = (string) $request->query('lang', app()->getLocale());

        if ($user->getAttribute('email_verified_at') === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
            if ($user instanceof MustVerifyEmail) {
                event(new Verified($user));
            }
            $user->notify(new WelcomeCustomer($locale));
        }
        $link->handle($user);
        $this->guard()->login($user);
        $request->session()->regenerate();

        return redirect(StorefrontRoutes::url('commerce.account', [], $locale))->with('commerce.success', __('commerce::account.verify.done', [], $locale));
    }

    public function showForgot(): View
    {
        return view(Layout::view('account.forgot-password'), ['seoTitle' => __('commerce::account.reset.title')]);
    }

    public function sendResetLink(Request $request): RedirectResponse
    {
        $data = $request->validate(['email' => ['required', 'string', 'email', 'max:190']]);
        Throttle::check('commerce-reset', $request, $data['email'], 3, 10, 600);
        Throttle::hit('commerce-reset', $request, $data['email'], 600);
        $locale = app()->getLocale();
        Password::broker((string) config('commerce.auth.passwords', 'users'))->sendResetLink(
            ['email' => mb_strtolower($data['email'])],
            fn ($user, string $token) => $user->notify(new CustomerResetPassword($token, $locale)),
        );

        // The same answer whether or not the email has an account.
        return back()->with('commerce.success', __('commerce::account.reset.sent'));
    }

    public function showReset(Request $request, string $token): View
    {
        return view(Layout::view('account.reset-password'), ['token' => $token, 'email' => (string) $request->query('email'), 'seoTitle' => __('commerce::account.reset.title')]);
    }

    public function reset(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'], 'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);
        $status = Password::broker((string) config('commerce.auth.passwords', 'users'))->reset(
            ['email' => mb_strtolower($data['email']), 'token' => $data['token'], 'password' => $data['password']],
            function ($user, string $password): void {
                $user->forceFill(['password' => Hash::make($password), 'email_verified_at' => $user->getAttribute('email_verified_at') ?? now()])->save();
            },
        );
        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => __('commerce::account.reset.invalid')]);
        }

        return redirect(StorefrontRoutes::url('commerce.account.login'))->with('commerce.success', __('commerce::account.reset.done'));
    }

    protected function guard(): StatefulGuard
    {
        /** @var StatefulGuard */
        return Auth::guard(CurrentCustomer::guard());
    }

    /** @return class-string<Model&Authenticatable> */
    protected function users(): string
    {
        return config('sunrice.auth.user_model');
    }
}
