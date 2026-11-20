<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Admin\Security\Captcha;
use Sunrice\Commerce\Checkout\Actions\CheckoutCode;
use Sunrice\Commerce\Checkout\Actions\SignInWithCheckoutCode;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

class CheckoutAccessController
{
    public function show(Request $request, CheckoutCode $codes): View
    {
        return $this->page('email', $codes->email($request) ?? commerce_customer()?->getAttribute('email'));
    }

    public function password(Request $request, CheckoutCode $codes, Captcha $captcha): View
    {
        $request->session()->put('url.intended', StorefrontRoutes::url('commerce.checkout'));

        return $this->page('password', $codes->email($request), $captcha->widget(app()->getLocale()));
    }

    public function code(Request $request, CheckoutCode $codes): View|RedirectResponse
    {
        $email = $codes->email($request);

        return $email === null
            ? redirect(StorefrontRoutes::url('commerce.checkout-access'))
            : $this->page('code', $email);
    }

    public function send(Request $request, CheckoutCode $codes): RedirectResponse
    {
        $data = $request->validate(['email' => ['required', 'string', 'email', 'max:190']]);
        $email = mb_strtolower(trim($data['email']));
        if (! $codes->send($request, $email)) {
            $route = $codes->email($request) === $email ? 'commerce.checkout-access.code' : 'commerce.checkout-access';

            return redirect(StorefrontRoutes::url($route))->withInput($data)->withErrors(['email' => __('commerce::checkout-access.rate_limited')]);
        }

        return redirect(StorefrontRoutes::url('commerce.checkout-access.code'));
    }

    public function verify(Request $request, SignInWithCheckoutCode $signIn, CheckoutCode $codes): RedirectResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'regex:/^[0-9]{8}$/']]);
        if ($signIn->handle($request, $data['code'])) {
            return redirect(StorefrontRoutes::url('commerce.checkout'));
        }

        $pending = $codes->email($request) !== null;
        $route = $pending ? 'commerce.checkout-access.code' : 'commerce.checkout-access';

        return redirect(StorefrontRoutes::url($route))
            ->withErrors([($pending ? 'code' : 'email') => __('commerce::checkout-access.invalid_code')]);
    }

    private function page(string $step, ?string $email, mixed $captcha = null): View
    {
        return view(Layout::view('checkout-access'), [
            'step' => $step,
            'email' => $email,
            'captcha' => $captcha,
            'seoTitle' => __('commerce::checkout-access.title'),
        ]);
    }
}
