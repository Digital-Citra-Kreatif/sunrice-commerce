<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Account;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Customers\Auth\LoginCodes;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/** Sign in with an emailed code: request it, then enter it. */
class LoginCodeController
{
    public function send(Request $request, LoginCodes $codes): RedirectResponse
    {
        abort_unless(commerce_feature('passwordless_login') && $codes->supported(), 404);
        $data = $request->validate(['email' => ['required', 'string', 'email', 'max:190']]);
        $email = mb_strtolower($data['email']);

        // 1 a minute per email, 10 an hour per IP.
        foreach ([["commerce-login-code:{$email}", 1, 60], ['commerce-login-code:ip:'.$request->ip(), 10, 3600]] as [$key, $max, $decay]) {
            if (RateLimiter::tooManyAttempts($key, $max)) {
                throw ValidationException::withMessages(['email' => __('commerce::account.throttled', ['seconds' => RateLimiter::availableIn($key)])]);
            }
            RateLimiter::hit($key, $decay);
        }

        $model = config('sunrice.auth.user_model');
        $user = $model::query()->where('email', $email)->first();
        if ($user !== null && ! LoginCodes::isRefusedStaff($user)) {
            $codes->request($user);
        }
        $request->session()->put('commerce.code_email', $email);

        // The same answer for unknown emails.
        return redirect(StorefrontRoutes::url('commerce.account.code'))->with('commerce.success', __('commerce::account.code.sent', ['email' => $email]));
    }

    public function show(Request $request): View|RedirectResponse
    {
        abort_unless(commerce_feature('passwordless_login'), 404);
        $email = $request->session()->get('commerce.code_email');
        if (! is_string($email)) {
            return redirect(StorefrontRoutes::url('commerce.account.login'));
        }

        return view(Layout::view('account.code'), ['email' => $email, 'seoTitle' => __('commerce::account.code.title')]);
    }

    public function consume(Request $request, LoginCodes $codes): RedirectResponse
    {
        abort_unless(commerce_feature('passwordless_login') && $codes->supported(), 404);
        $data = $request->validate(['code' => ['required', 'string', 'max:20']]);
        $email = (string) $request->session()->get('commerce.code_email', '');
        $model = config('sunrice.auth.user_model');
        $user = $email === '' ? null : $model::query()->where('email', $email)->first();
        if ($user === null || LoginCodes::isRefusedStaff($user)) {
            throw ValidationException::withMessages(['code' => __('commerce::account.code.incorrect')]);
        }
        $error = $codes->consume($user, trim($data['code']), $request->boolean('remember'));
        if ($error !== null) {
            throw ValidationException::withMessages(['code' => __('commerce::account.code.'.$error)]);
        }
        $request->session()->forget('commerce.code_email');
        $request->session()->regenerate();

        return redirect()->intended(StorefrontRoutes::url('commerce.account'));
    }
}
