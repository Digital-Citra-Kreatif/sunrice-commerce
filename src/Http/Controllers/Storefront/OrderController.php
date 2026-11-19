<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\Auth\Throttle;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Orders\Actions\CancelOrderByCustomer;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderAccess;
use Sunrice\Commerce\Orders\OrderAccessChallenge;
use Sunrice\Commerce\Payments\Actions\PayWithMethod;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * The customer's order page and the guest order lookup.
 */
class OrderController
{
    public function show(Request $request, string $key): View|RedirectResponse
    {
        $order = $this->find($request, $key);
        if ($order->isQuote()) {
            return redirect($order->url());
        }

        return view(Layout::view('order'), $this->data($request, $order) + ['seoTitle' => __('commerce::checkout.order.title', ['number' => $order->displayNumber()])]);
    }

    public function cancel(Request $request, string $key, CancelOrderByCustomer $cancel): RedirectResponse
    {
        $order = $this->find($request, $key);
        try {
            $cancel->handle($order, $request->string('reason')->limit(250)->toString() ?: null);
        } catch (InvalidTransition $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return back()->with('commerce.success', __('commerce::checkout.order.cancelled'));
    }

    public function invoice(Request $request, string $key, Documents $documents): Response
    {
        $order = $this->find($request, $key);
        abort_unless($this->invoiceAvailable($order), 404);

        return response($documents->pdf($order, 'invoice'), 200, ['Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.str_replace('/', '-', (string) $order->number).'.pdf"']);
    }

    protected function invoiceAvailable(Order $order): bool
    {
        return ! $order->isQuote() && commerce_feature('documents') && $order->isPaid()
            && (bool) app(StoreSettings::class)->get('documents.customer_invoice_download', true);
    }

    public function trackForm(): View
    {
        return view(Layout::view('track-order'), ['seoTitle' => __('commerce::checkout.track.title')]);
    }

    public function track(Request $request): RedirectResponse
    {
        return $this->requestAccess($request);
    }

    public function requestAccess(Request $request, bool $confirm = false): RedirectResponse
    {
        $data = $request->validate(['number' => ['required', 'string', 'max:60'], 'email' => ['required', 'string', 'email', 'max:190']]);
        $email = mb_strtolower(trim($data['email']));
        Throttle::check('commerce-track', $request, $email, 5, 20, 600, 'number');
        Throttle::hit('commerce-track', $request, $email, 600);
        $number = trim($data['number']);
        $order = Order::query()->where('email', $email)
            ->when($confirm, fn ($query) => $query->where('type', 'order')->where('number', $number),
                fn ($query) => $query->where(fn ($numbers) => $numbers->where('number', $number)->orWhere('quote_number', $number)))
            ->first();
        if ($order !== null && app(OrderAccess::class)->allows($request, $order)) {
            return $this->accessDestination($order, $confirm);
        }

        app(OrderAccessChallenge::class)->send($request, $order, $confirm);

        return redirect(StorefrontRoutes::url('commerce.track-order.code'));
    }

    public function code(): View
    {
        return view(Layout::view('track-order'), ['verification' => true, 'seoTitle' => __('commerce::checkout.track.verify_title')]);
    }

    public function verify(Request $request, OrderAccessChallenge $challenge, OrderAccess $access): RedirectResponse
    {
        $data = $request->validate(['code' => ['required', 'string', 'regex:/^[0-9]{8}$/']]);
        $verified = $challenge->verify($request, $data['code']);
        if ($verified === null) {
            return back()->withErrors(['code' => __('commerce::checkout.track.invalid_code')]);
        }

        $request->session()->regenerate();
        $access->grantGuest($request, $verified['order']);

        return $this->accessDestination($verified['order'], $verified['confirm']);
    }

    private function accessDestination(Order $order, bool $confirm): RedirectResponse
    {
        return redirect($confirm ? commerce_url('commerce.confirm-payment', ['order' => $order->order_key]) : $order->url());
    }

    public function find(Request $request, string $key): Order
    {
        return app(OrderAccess::class)->find($request, $key);
    }

    /** @return array<string, mixed> */
    public function data(Request $request, Order $order): array
    {
        $order->load(['items.children', 'adjustments', 'payments', 'shipments']);
        $payment = $order->payment();
        $method = $payment !== null ? app(PaymentManager::class)->get($payment->method) : null;
        $guestWithAccounts = commerce_customer() === null && $order->user_id === null && commerce_feature('accounts');
        $accountRequested = $guestWithAccounts && $this->requestedAccountAtCheckout($order);

        return [
            'order' => $order,
            'payment' => $payment,
            'instructionsView' => $method?->instructionsView(),
            'whatsappUrl' => $order->meta('whatsapp_url'),
            'openWhatsApp' => $request->boolean('whatsapp') && $order->meta('whatsapp_url') !== null,
            'payUrl' => commerce_feature('payments') && app(PayWithMethod::class)->payable($order) && $order->payment_method !== 'whatsapp'
                ? commerce_url('commerce.order.pay', ['key' => $order->order_key]) : null,
            'downloads' => DownloadGrant::query()->with('file')->where('order_id', $order->id)->whereNull('revoked_at')->get(),
            'invoiceUrl' => $this->invoiceAvailable($order) ? commerce_url('commerce.order.invoice', ['key' => $order->order_key]) : null,
            'canCancel' => app(CancelOrderByCustomer::class)->allowed($order),
            'invite' => $guestWithAccounts && ! $accountRequested && app(StoreSettings::class)->get('accounts.registration', true),
            'accountRequested' => $accountRequested,
            'registerUrl' => commerce_feature('accounts') ? StorefrontRoutes::url('commerce.account.register') : null,
        ];
    }

    private function requestedAccountAtCheckout(Order $order): bool
    {
        $recorded = $order->meta('checkout_account_requested');
        if (is_bool($recorded)) {
            return $recorded;
        }

        // Older checkouts may still have the submitted choice on their converted cart.
        if ($order->checkout_token === null) {
            return false;
        }
        $checkout = Cart::query()->where('order_id', $order->id)->value('checkout');

        return (bool) data_get($checkout, 'create_account');
    }
}
