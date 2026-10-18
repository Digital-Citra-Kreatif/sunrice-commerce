<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Payments\Actions\PayWithMethod;
use Sunrice\Commerce\Payments\Actions\RecordPaymentResult;
use Sunrice\Commerce\Payments\Contracts\HandlesReturn;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Support\DomainException;
use Throwable;

/** The pay page (order/{key}/pay) and the return from a gateway. */
class PayController
{
    public function show(string $key, OrderController $orders, PayWithMethod $pay): View|RedirectResponse
    {
        $order = $orders->find($key, 'order');
        if (! $pay->payable($order)) {
            return redirect($order->url());
        }

        return view(Layout::view('pay'), ['order' => $order, 'methods' => $pay->options($order), 'seoTitle' => __('commerce::payments.pay_title', ['number' => $order->displayNumber()])]);
    }

    public function pay(Request $request, string $key, OrderController $orders, PayWithMethod $pay): RedirectResponse
    {
        $order = $orders->find($key, 'order');
        $data = $request->validate(['payment_method' => ['required', 'string', 'max:60']]);
        try {
            $start = $pay->handle($order, $data['payment_method']);
        } catch (DomainException $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return $start->kind === 'redirect' && $start->url !== null ? redirect()->away($start->url) : redirect($order->url());
    }

    public function return(Request $request, string $key, OrderController $orders, PaymentManager $payments, RecordPaymentResult $record): RedirectResponse
    {
        $order = $orders->find($key, 'order');
        $payment = $order->payments()->latest('id')->first();
        $method = $payment !== null ? $payments->get($payment->method) : null;
        if ($payment !== null && $method instanceof HandlesReturn) {
            try {
                $record->handle($payment, $method->handleReturn($request, $payment), Actor::gateway($payment->method));
            } catch (Throwable $e) {
                report($e);
            }
        }

        return redirect($order->url());
    }
}
