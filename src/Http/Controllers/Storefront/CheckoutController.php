<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Sunrice\Admin\Security\Captcha;
use Sunrice\Commerce\Cart\Actions\ApplyVoucher;
use Sunrice\Commerce\Cart\Actions\RemoveVoucher;
use Sunrice\Commerce\Cart\Actions\UpdateCheckoutData;
use Sunrice\Commerce\Cart\CartException;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Cart\CartView;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Checkout\CheckoutChanged;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\CheckoutFields;
use Sunrice\Commerce\Checkout\CheckoutMode;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Checkout\CheckoutValidator;
use Sunrice\Commerce\Checkout\Events\CheckoutStarted;
use Sunrice\Commerce\Checkout\TermsPage;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\OrderAccess;
use Sunrice\Commerce\Payments\Contracts\PaymentMethod;
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * The one-page checkout. Works without JavaScript: the form posts with
 * "update" (save and recalculate shipping) or "place"; with JavaScript,
 * address changes refresh rates and totals through refresh().
 */
class CheckoutController
{
    // Per request (the router keeps controller instances).
    protected function carts(): CartManager
    {
        return app(CartManager::class);
    }

    protected function settings(): StoreSettings
    {
        return app(StoreSettings::class);
    }

    protected function mode(): CheckoutMode
    {
        return app(CheckoutMode::class);
    }

    protected function payments(): PaymentManager
    {
        return app(PaymentManager::class);
    }

    public function show(Request $request): View|RedirectResponse
    {
        $cart = $this->carts()->current();
        if ($cart === null || $cart->items()->doesntExist()) {
            return redirect(StorefrontRoutes::url('commerce.cart'))->with('commerce.error', __('commerce::checkout.errors.empty'));
        }
        if (commerce_customer() === null && ! $this->settings()->get('checkout.guest_checkout', true) && commerce_feature('accounts')) {
            $request->session()->put('url.intended', StorefrontRoutes::url('commerce.checkout'));

            return redirect(StorefrontRoutes::url('commerce.account.login'))->with('commerce.error', __('commerce::checkout.errors.sign_in'));
        }
        $data = $this->prefill($cart);
        if (! isset($cart->checkout['started_at'])) {
            app(UpdateCheckoutData::class)->handle($cart, ['started_at' => now()->toIso8601String()]);
            CheckoutStarted::dispatch($cart);
        }
        [$data, $view] = $this->resolveSelections($cart, $data);
        $view->acknowledgePrices();

        return view(Layout::view('checkout'), [
            ...$this->viewData($cart, $data, $view),
            'seoTitle' => __('commerce::checkout.title'),
            'captcha' => app(Captcha::class)->widget(app()->getLocale()),
        ]);
    }

    public function submit(Request $request, PlaceOrder $place, UpdateCheckoutData $update): RedirectResponse
    {
        $cart = $this->carts()->current();
        if ($cart === null) {
            return redirect(StorefrontRoutes::url('commerce.cart'));
        }
        $data = $this->postedData($request, $cart, fullForm: true);
        if ($request->input('action') === 'use_saved_address') {
            $user = commerce_customer();
            $address = $user !== null ? Customer::forUser($user)->addresses()->find($request->integer('address_id')) : null;
            if ($address === null) {
                return redirect(StorefrontRoutes::url('commerce.checkout').'#shipping')
                    ->with('commerce.error', __('commerce::checkout.address_picker.choose_saved'));
            }
            $data = $data->merge(['shipping_address' => $address->toAddress(), 'save_address' => false]);
        }
        $update->handle($cart, $data->toArray());

        if ($request->input('action') !== 'place') {
            $section = $request->input('action') === 'update_points' ? '#checkout-points' : '#shipping';

            return redirect(StorefrontRoutes::url('commerce.checkout').$section);
        }
        $captcha = app(Captcha::class);
        if (! $captcha->passes($request)) {
            return redirect(StorefrontRoutes::url('commerce.checkout').'#checkout-captcha')
                ->withErrors(['captcha' => __('commerce::payments.confirm.captcha')]);
        }
        $guestCheckout = commerce_customer() === null;
        try {
            $placed = $place->handle($cart, $data, (string) $request->input('totals_hash'), $request->only('password'),
                ['ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
        } catch (CheckoutChanged $e) {
            return redirect(StorefrontRoutes::url('commerce.checkout'))->with('commerce.changes', $e->changes)->with('commerce.error', $e->getMessage());
        } catch (CheckoutRefused $e) {
            return redirect(StorefrontRoutes::url('commerce.checkout'))->with('commerce.error', $e->getMessage());
        } catch (ValidationException $e) {
            return redirect(StorefrontRoutes::url('commerce.checkout'))->withErrors($e->errors())
                ->withInput($request->except(['password', $captcha->field()]));
        }
        $this->carts()->forget();
        if ($guestCheckout) {
            app(OrderAccess::class)->grantGuest($request, $placed->order);
        }

        return redirect($placed->response->url)->with('commerce.success', $placed->response->message);
    }

    /** JSON: save what was entered and return the rates, payment methods and totals. */
    public function refresh(Request $request, UpdateCheckoutData $update): JsonResponse
    {
        $cart = $this->carts()->current();
        abort_if($cart === null, 404);
        $data = $this->postedData($request, $cart);
        $update->handle($cart, $data->toArray());

        return $this->checkoutResponse($cart, $data);
    }

    public function voucher(Request $request, UpdateCheckoutData $update, ApplyVoucher $apply, RemoveVoucher $remove): JsonResponse|RedirectResponse
    {
        $cart = $this->carts()->current();
        if ($cart === null || $cart->items()->doesntExist()) {
            return $request->expectsJson() ? response()->json(['message' => __('commerce::checkout.errors.empty')], 404)
                : redirect(StorefrontRoutes::url('commerce.cart'));
        }

        $data = $this->postedData($request, $cart, fullForm: true);
        $update->handle($cart, $data->toArray());
        $removing = $request->has('remove_voucher');
        $field = $removing ? 'remove_voucher' : 'voucher_code';
        $validator = Validator::make($request->only($field), [$field => ['required', 'string', 'max:64']]);
        $feedback = [];
        if ($validator->fails()) {
            $feedback['voucherError'] = $validator->errors()->first($field);
        } else {
            $code = (string) $validator->validated()[$field];
            try {
                if ($removing) {
                    $remove->handle($code);
                    $feedback['voucherMessage'] = __('commerce::storefront.cart.voucher_removed');
                } else {
                    $applied = $apply->handle($code, $data->context());
                    $feedback['voucherMessage'] = __('commerce::storefront.cart.voucher_applied', ['code' => $applied]);
                }
            } catch (CartException $e) {
                $feedback = ['voucherError' => $e->getMessage(), 'voucherCode' => $code];
            }
        }

        return $request->expectsJson() ? $this->checkoutResponse($cart, $data, $feedback)
            : redirect(StorefrontRoutes::url('commerce.checkout').'#checkout-vouchers')->with($feedback);
    }

    /** @param  array<string, string>  $voucherFeedback */
    private function checkoutResponse(Cart $cart, CheckoutData $data, array $voucherFeedback = []): JsonResponse
    {
        [$data, $view] = $this->resolveSelections($cart, $data);
        $props = $this->viewData($cart, $data, $view);
        $money = app(MoneyFormatter::class);

        return response()->json([
            'rates' => array_map(fn (array $r) => [...$r, 'cost_formatted' => $money->format((int) $r['cost'])], $view->state->shipping['rates']),
            'selected_rate' => $view->state->shipping['rate']['id'] ?? null,
            'payment_methods' => $props['paymentMethods'],
            'selected_payment_method' => $data->paymentMethod(),
            'totals' => array_map(fn (int $a) => ['amount' => $a, 'formatted' => $money->format($a)], $view->state->totals),
            'hash' => $view->state->hash(),
            'notices' => $view->state->notices,
            'rates_html' => view(Layout::view('partials.shipping-methods'), $props)->render(),
            'payments_html' => view(Layout::view('partials.payment-methods'), $props)->render(),
            'vouchers_html' => $voucherFeedback === [] ? null : view(Layout::view('partials.checkout-vouchers'), [...$props, ...$voucherFeedback])->render(),
            'summary' => view(Layout::view('checkout.summary'), $props)->render(),
        ]);
    }

    private function postedData(Request $request, Cart $cart, bool $fullForm = false): CheckoutData
    {
        $input = $request->except(['password', 'totals_hash', 'action']);
        if ($fullForm) {
            $input['_form'] = 'checkout';
        }
        if (commerce_customer() === null || ! commerce_feature('loyalty')) {
            $input['use_points'] = false;
        }

        return CheckoutData::fromCart($cart)->merge($input);
    }

    /** Signed-in customers start with their profile and default address. */
    protected function prefill(Cart $cart): CheckoutData
    {
        $data = CheckoutData::fromCart($cart);
        $user = commerce_customer();
        if ($user === null) {
            return $data;
        }
        $customer = Customer::forUser($user);
        $defaults = $data->email() === null ? ['email' => $customer->email, 'name' => $customer->name, 'phone' => $customer->phone] : [];
        if ($data->shippingAddress() === null) {
            $address = $customer->addresses()->orderByDesc('default_shipping')->orderBy('id')->first();
            if ($address !== null) {
                $defaults['shipping_address'] = $address->toAddress();
                $defaults['address_id'] = $address->id;
            }
        }

        return $data->merge(array_filter($defaults));
    }

    /** @return array{CheckoutData, CartView} */
    private function resolveSelections(Cart $cart, CheckoutData $data): array
    {
        $view = CartView::for($cart, $data->context());
        if ($this->mode()->requiresRate() && $view->state->shipping['needed'] && $view->state->shipping['rate'] === null) {
            // Pickup changes the required contact and address fields. Leave it as an explicit choice.
            $delivery = array_find($view->state->shipping['rates'], fn (array $rate): bool => ! str_starts_with($rate['id'], 'pickup:'));
            $rate = $delivery['id'] ?? null;
            if ($rate !== $data->shippingRate()) {
                $data = $data->merge(['shipping_rate' => $rate]);
                $view = CartView::for($cart, $data->context());
            }
        }
        $available = $this->availablePayments($view->state);
        $selected = $data->paymentMethod();
        if ($selected === null || ! isset($available[$selected])) {
            $default = array_key_first($available);
            if ($selected !== $default) {
                $data = $data->merge(['payment_method' => $default]);
                $view = CartView::for($cart, $data->context());
            }
        }

        return [$data, $view];
    }

    /** @return array<string, PaymentMethod> */
    private function availablePayments(CalculationState $state): array
    {
        $context = PaymentContext::fromState($state);

        return $this->mode()->payment() && $context->amount > 0 ? $this->payments()->available($context) : [];
    }

    /** @return array<string, mixed> */
    protected function viewData(Cart $cart, CheckoutData $data, CartView $view): array
    {
        $state = $view->state;
        $user = commerce_customer();
        $customer = $user !== null ? Customer::forUser($user) : null;
        $methods = [];
        foreach ($this->availablePayments($state) as $key => $method) {
            $methods[] = ['key' => $key, 'title' => PaymentManager::titleOf($method), 'description' => method_exists($method, 'description') ? $method->description() : null];
        }
        $validator = app(CheckoutValidator::class);

        return [
            'cart' => $view,
            'state' => $state,
            'data' => $data,
            'mode' => $this->mode(),
            'settings' => $this->settings(),
            'needsAddress' => $state->shipping['needed'] && $this->mode()->shipping(),
            'paymentMethods' => $methods,
            'savedAddresses' => $customer?->addresses()->orderByDesc('default_shipping')->orderBy('id')->get() ?? collect(),
            'loyaltyPoints' => commerce_feature('loyalty') ? (int) ($customer->loyalty_points ?? 0) : 0,
            'guest' => $user === null,
            'offerAccount' => $user === null && commerce_feature('accounts') && $this->settings()->get('accounts.registration', true)
                && $this->settings()->get('checkout.create_account', 'offer') !== 'never',
            'accountRequired' => $user === null && $validator->createsAccount($data->merge(['create_account' => true])) && $this->settings()->get('checkout.create_account') === 'always',
            'extraFields' => app(CheckoutFields::class)->for($data, $state),
            'termsUrl' => TermsPage::url(),
            'submitLabel' => __('commerce::checkout.submit.'.$this->mode()->completion()),
        ];
    }
}
