<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
     * another browser (an e-wallet app), isn't left on a "not found" page:
     * they are sent to sign in or verify the order instead, and shown
     * nothing about it until then.
     */
    public function return(Request $request, string $key, OrderAccess $access, PaymentManager $payments, RecordPaymentResult $record): RedirectResponse
    {
        abort_unless(strlen($key) === 40, 404);
        $order = Order::query()->where('order_key', $key)->first();
        abort_if($order === null, 404);

        $payment = $order->payments()->latest('id')->first();
        $method = $payment !== null ? $payments->get($payment->method) : null;
        if ($payment !== null && $method instanceof HandlesReturn) {
            try {
                $record->handle($payment, $method->handleReturn($request, $payment), Actor::gateway($payment->method));
            } catch (Throwable $e) {
                report($e);
            }
        }

        if ($access->allows($request, $order)) {
            return redirect($order->url());
        }
        $message = __('commerce::payments.return_verify', ['number' => $order->displayNumber()]);
        if ($order->user_id !== null && ! $order->wasPlacedAsGuest()) {
            redirect()->setIntendedUrl($order->url());

            return redirect(StorefrontRoutes::url('commerce.account.login'))->with('commerce.success', $message);
        }

        return redirect(StorefrontRoutes::url('commerce.track-order', ['number' => $order->number]))->with('commerce.success', $message);
    }
}
