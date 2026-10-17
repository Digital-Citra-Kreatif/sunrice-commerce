<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Customers\Auth\Throttle;
use Sunrice\Commerce\Orders\Actions\CancelOrderByCustomer;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\PayWithMethod;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * The customer's order page (by its long random key, no sign-in; noindex)
 * and the guest order lookup by number and email.
 */
class OrderController
{
    public function show(Request $request, string $key): View|RedirectResponse
    {
        $order = $this->find($key, 'order');
        if ($order->isQuote()) {
            return redirect($order->url());
        }

        return view(Layout::view('order'), $this->data($request, $order) + ['seoTitle' => __('commerce::checkout.order.title', ['number' => $order->displayNumber()])]);
    }

    public function cancel(Request $request, string $key, CancelOrderByCustomer $cancel): RedirectResponse
    {
        $order = $this->find($key, 'order');
        try {
            $cancel->handle($order, $request->string('reason')->limit(250)->toString() ?: null);
        } catch (InvalidTransition $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return back()->with('commerce.success', __('commerce::checkout.order.cancelled'));
    }

    public function trackForm(): View
    {
        return view(Layout::view('track-order'), ['seoTitle' => __('commerce::checkout.track.title')]);
    }

    public function track(Request $request): RedirectResponse
    {
        $data = $request->validate(['number' => ['required', 'string', 'max:60'], 'email' => ['required', 'string', 'email', 'max:190']]);
        Throttle::check('commerce-track', $request, mb_strtolower($data['email']), 10, 20, 600, 'number');
        $order = Order::query()->where('type', 'order')->where(fn ($q) => $q->where('number', trim($data['number']))->orWhere('quote_number', trim($data['number'])))
            ->where('email', mb_strtolower(trim($data['email'])))->first();
        if ($order === null) {
            Throttle::hit('commerce-track', $request, mb_strtolower($data['email']), 600);

            return back()->withInput()->withErrors(['number' => __('commerce::checkout.track.not_found')]);
        }

        return redirect($order->url());
    }

    public function find(string $key, string $type): Order
    {
        abort_unless(strlen($key) === 40, 404);
        $order = Order::query()->where('order_key', $key)->first();
        abort_if($order === null, 404);

        return $order;
    }

    /** @return array<string, mixed> */
    public function data(Request $request, Order $order): array
    {
        $order->load(['items.children', 'adjustments', 'payments', 'shipments']);
        $payment = $order->payment();
        $method = $payment !== null ? app(PaymentManager::class)->get($payment->method) : null;

        return [
            'order' => $order,
            'payment' => $payment,
            'instructionsView' => $method?->instructionsView(),
            'whatsappUrl' => $order->meta('whatsapp_url'),
            'openWhatsApp' => $request->boolean('whatsapp') && $order->meta('whatsapp_url') !== null,
            'payUrl' => commerce_feature('payments') && app(PayWithMethod::class)->payable($order) && $order->payment_method !== 'whatsapp'
                ? commerce_url('commerce.order.pay', ['key' => $order->order_key]) : null,
            'canCancel' => app(CancelOrderByCustomer::class)->allowed($order),
            'invite' => commerce_customer() === null && $order->user_id === null && commerce_feature('accounts'),
            'registerUrl' => commerce_feature('accounts') ? StorefrontRoutes::url('commerce.account.register') : null,
        ];
    }
}
