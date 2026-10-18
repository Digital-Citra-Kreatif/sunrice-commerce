<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Cart\Actions\UpdateCheckoutData;
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
use Sunrice\Commerce\Payments\PaymentContext;
use Sunrice\Commerce\Payments\PaymentManager;
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
    protected CartManager $carts {
        get => app(CartManager::class);
    }

    protected StoreSettings $settings {
        get => app(StoreSettings::class);
    }

    protected CheckoutMode $mode {
        get => app(CheckoutMode::class);
    }

    protected PaymentManager $payments {
        get => app(PaymentManager::class);
    }

    public function show(Request $request): View|RedirectResponse
    {
        $cart = $this->carts->current();
        if ($cart === null || $cart->items()->doesntExist()) {
            return redirect(StorefrontRoutes::url('commerce.cart'))->with('commerce.error', __('commerce::checkout.errors.empty'));
        }
        if (commerce_customer() === null && ! $this->settings->get('checkout.guest_checkout', true) && commerce_feature('accounts')) {
            $request->session()->put('url.intended', StorefrontRoutes::url('commerce.checkout'));

            return redirect(StorefrontRoutes::url('commerce.account.login'))->with('commerce.error', __('commerce::checkout.errors.sign_in'));
        }
        $data = $this->prefill($cart);
        if (! isset($cart->checkout['started_at'])) {
            app(UpdateCheckoutData::class)->handle($cart, ['started_at' => now()->toIso8601String()]);
            CheckoutStarted::dispatch($cart);
        }
        $view = CartView::for($cart, $data->context());
        $view->acknowledgePrices();

        return view(Layout::view('checkout'), [...$this->viewData($cart, $data, $view), 'seoTitle' => __('commerce::checkout.title')]);
    }

    public function submit(Request $request, PlaceOrder $place, UpdateCheckoutData $update): RedirectResponse
    {
        $cart = $this->carts->current();
        if ($cart === null) {
            return redirect(StorefrontRoutes::url('commerce.cart'));
        }
        $data = CheckoutData::fromCart($cart)->merge([...$request->except(['password', 'totals_hash', 'action']), '_form' => 'checkout']);
        $update->handle($cart, $data->toArray());

        if ($request->input('action') !== 'place') {
            return redirect(StorefrontRoutes::url('commerce.checkout').'#shipping');
        }
        try {
            $placed = $place->handle($cart, $data, (string) $request->input('totals_hash'), $request->only('password'),
                ['ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
        } catch (CheckoutChanged $e) {
            return redirect(StorefrontRoutes::url('commerce.checkout'))->with('commerce.changes', $e->changes)->with('commerce.error', $e->getMessage());
        } catch (CheckoutRefused $e) {
            return redirect(StorefrontRoutes::url('commerce.checkout'))->with('commerce.error', $e->getMessage());
        } catch (ValidationException $e) {
            return redirect(StorefrontRoutes::url('commerce.checkout'))->withErrors($e->errors())->withInput($request->except('password'));
        }
        $this->carts->forget();
        $request->session()->put('commerce.orders.'.$placed->order->id, $placed->order->order_key);

        return redirect($placed->response->url)->with('commerce.success', $placed->response->message);
    }

    /** JSON: save what was entered and return the rates, payment methods and totals. */
    public function refresh(Request $request, UpdateCheckoutData $update): JsonResponse
    {
        $cart = $this->carts->current();
        abort_if($cart === null, 404);
        $data = CheckoutData::fromCart($cart)->merge($request->except(['password', 'totals_hash', 'action']));
        $update->handle($cart, $data->toArray());
        $view = CartView::for($cart, $data->context());
        $props = $this->viewData($cart, $data, $view);
        $money = app(MoneyFormatter::class);

        return response()->json([
            'rates' => array_map(fn (array $r) => [...$r, 'cost_formatted' => $money->format((int) $r['cost'])], $view->state->shipping['rates']),
            'selected_rate' => $view->state->shipping['rate']['id'] ?? null,
            'payment_methods' => $props['paymentMethods'],
            'totals' => array_map(fn (int $a) => ['amount' => $a, 'formatted' => $money->format($a)], $view->state->totals),
            'hash' => $view->state->hash(),
            'notices' => $view->state->notices,
            'rates_html' => view(Layout::view('partials.shipping-methods'), $props)->render(),
            'payments_html' => view(Layout::view('partials.payment-methods'), $props)->render(),
            'summary' => '<aside class="commerce-checkout__summary" id="summary" data-commerce-summary>'.view(Layout::view('partials.checkout-summary'), $props)->render().'</aside>',
        ]);
    }

    /** Signed-in customers start with their profile and default address. */
    protected function prefill(Cart $cart): CheckoutData
    {
        $data = CheckoutData::fromCart($cart);
        $user = commerce_customer();
        if ($user === null || $data->email() !== null) {
            return $data;
        }
        $customer = Customer::forUser($user);
        $address = $customer->addresses()->orderByDesc('default_shipping')->first();

        return $data->merge(array_filter([
            'email' => $customer->email,
            'name' => $customer->name,
            'phone' => $customer->phone,
            'shipping_address' => $address?->toAddress(),
        ]));
    }

    /** @return array<string, mixed> */
    protected function viewData(Cart $cart, CheckoutData $data, CartView $view): array
    {
        $state = $view->state;
        $user = commerce_customer();
        $methods = [];
        if ($this->mode->payment() && $state->totals['total'] > 0) {
            foreach ($this->payments->available(PaymentContext::fromState($state)) as $key => $method) {
                $methods[] = ['key' => $key, 'title' => PaymentManager::titleOf($method), 'description' => method_exists($method, 'description') ? $method->description() : null];
            }
        }
        $validator = app(CheckoutValidator::class);

        return [
            'cart' => $view,
            'state' => $state,
            'data' => $data,
            'mode' => $this->mode,
            'settings' => $this->settings,
            'needsAddress' => $state->shipping['needed'] && $this->mode->shipping(),
            'paymentMethods' => $methods,
            'savedAddresses' => $user !== null ? Customer::forUser($user)->addresses()->get() : collect(),
            'guest' => $user === null,
            'offerAccount' => $user === null && commerce_feature('accounts') && $this->settings->get('accounts.registration', true)
                && $this->settings->get('checkout.create_account', 'offer') !== 'never',
            'accountRequired' => $user === null && $validator->createsAccount($data->merge(['create_account' => true])) && $this->settings->get('checkout.create_account') === 'always',
            'extraFields' => app(CheckoutFields::class)->for($data, $state),
            'termsUrl' => TermsPage::url(),
            'submitLabel' => __('commerce::checkout.submit.'.$this->mode->completion()),
        ];
    }
}
