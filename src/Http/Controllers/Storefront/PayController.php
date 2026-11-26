<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Cart\CartManager;
use Sunrice\Commerce\Checkout\Actions\ResolveCheckoutSession;
use Sunrice\Commerce\Checkout\CheckoutRefused;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderAccess;
use Sunrice\Commerce\Payments\Actions\PayWithMethod;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Contracts\HandlesReturn;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Commerce\Support\DomainException;
use Throwable;

/** The pay page (order/{key}/pay) and the return from a gateway. */
class PayController
{
    public function show(Request $request, string $key, OrderController $orders, PayWithMethod $pay): View|RedirectResponse
    {
        $order = $orders->find($request, $key);
        if (! $pay->payable($order)) {
            return redirect($order->url());
        }

        return view(Layout::view('pay'), ['order' => $order, 'methods' => $pay->options($order), 'seoTitle' => __('commerce::payments.pay_title', ['number' => $order->displayNumber()])]);
    }

    public function pay(Request $request, string $key, OrderController $orders, PayWithMethod $pay): RedirectResponse
    {
        $order = $orders->find($request, $key);
        $data = $request->validate(['payment_method' => ['required', 'string', 'max:60']]);
        try {
            $start = $pay->handle($order, $data['payment_method']);
        } catch (DomainException $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return $start->kind === 'redirect' && $start->url !== null ? redirect()->away($start->url) : redirect($order->url());
    }

    /**
     * The customer is back from a gateway. The payment is checked whoever
     * returns (a HandlesReturn method asks its gateway, not the query string),
     * so a guest whose access lapsed while paying, or who comes back in
     * another browser (an e-wallet app), signs in first (the route is for
     * accounts) and comes back to this address.
     */
    public function return(Request $request, string $key, OrderAccess $access, PaymentManager $payments, RecordPaymentResult $record): RedirectResponse
    {
        abort_unless(strlen($key) === 40, 404);
        $order = Order::withTrashed()->where('order_key', $key)->first();
        abort_if($order === null, 404);
        $wasDraft = $order->type === ResolveCheckoutSession::TYPE;
        if ($wasDraft) {
            try {
                $order = app(ResolveCheckoutSession::class)->handle($order, $access->allows($request, $order));
            } catch (CheckoutRefused) {
                return redirect(StorefrontRoutes::url('commerce.checkout'));
            }
            if ($order === null) {
                return redirect(StorefrontRoutes::url('commerce.checkout'));
            }
        }
        abort_if($order->trashed(), 404);

        $payment = $order->payments()->reorder('id', 'desc')->first();
        $method = $payment !== null ? $payments->get($payment->method) : null;
        if (! $wasDraft && $payment !== null && $method instanceof HandlesReturn) {
            try {
                $record->handle($payment, $method->handleReturn($request, $payment), Actor::gateway($payment->method));
            } catch (Throwable $e) {
                report($e);
            }
        }

        if ($access->allows($request, $order)) {
            if ($request->session()->get(ResolveCheckoutSession::SESSION_KEY) === $key) {
                $request->session()->forget(ResolveCheckoutSession::SESSION_KEY);
                $carts = app(CartManager::class);
                $cart = $carts->current();
                if ($cart === null || $cart->id === (int) $order->meta('checkout_cart_id')) {
                    $carts->forget();
                }
            }

            return redirect($order->url());
        }
        // Signed in as someone else: the order isn't theirs to see.
        abort(404);
    }
}
