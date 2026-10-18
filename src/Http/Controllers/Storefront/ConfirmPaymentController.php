<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Customers\Auth\Throttle;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Actions\SubmitPaymentConfirmation;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Storefront\StorefrontRoutes;
use Sunrice\Support\Captcha;

/**
 * /confirm-payment: "I have paid" for an order, reached from the order
 * page (with its key) or by order number and email.
 */
class ConfirmPaymentController
{
    public function show(Request $request): View
    {
        $key = (string) $request->query('order', '');
        $order = strlen($key) === 40 ? Order::query()->where('order_key', $key)->first() : null;
        $payment = $order?->payments()->where('status', 'pending')->latest('id')->first();

        return view(Layout::view('confirm-payment'), [
            'order' => $order,
            'payment' => $payment,
            'accounts' => (array) ($payment->instructions['accounts'] ?? []),
            'proofRequired' => ($payment->instructions['confirmation'] ?? null) === 'required',
            'captcha' => Captcha::widget(app()->getLocale()),
            'seoTitle' => __('commerce::payments.confirm.title'),
        ]);
    }

    public function lookup(Request $request): RedirectResponse
    {
        $data = $request->validate(['number' => ['required', 'string', 'max:60'], 'email' => ['required', 'email', 'max:190']]);
        Throttle::check('commerce-confirm-lookup', $request, mb_strtolower($data['email']), 10, 20, 600, 'number');
        $order = Order::query()->where('type', 'order')->where('number', trim($data['number']))->where('email', mb_strtolower(trim($data['email'])))->first();
        if ($order === null) {
            Throttle::hit('commerce-confirm-lookup', $request, mb_strtolower($data['email']), 600);

            return back()->withInput()->withErrors(['number' => __('commerce::checkout.track.not_found')]);
        }

        return redirect(StorefrontRoutes::url('commerce.confirm-payment').'?order='.$order->order_key);
    }

    public function submit(Request $request, SubmitPaymentConfirmation $submit): RedirectResponse
    {
        $key = (string) $request->input('order');
        $order = strlen($key) === 40 ? Order::query()->where('order_key', $key)->first() : null;
        abort_if($order === null, 404);
        if (($field = Captcha::field()) !== null && ! Captcha::verify((string) $request->input($field), $request->ip())) {
            return back()->withInput()->withErrors(['captcha' => __('commerce::payments.confirm.captcha')]);
        }
        $submit->handle($order, $request->except(['order', 'proof']), $request->file('proof'), $request->ip());

        return redirect($order->url())->with('commerce.success', __('commerce::payments.confirm.thanks'));
    }
}
