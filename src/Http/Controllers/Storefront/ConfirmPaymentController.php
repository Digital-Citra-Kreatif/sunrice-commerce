<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Admin\Security\Captcha;
use Sunrice\Commerce\Orders\OrderAccess;
use Sunrice\Commerce\Payments\Actions\SubmitPaymentConfirmation;
use Sunrice\Commerce\Storefront\Layout;

/**
 * /confirm-payment: "I have paid" for an order, reached from the order
 * page (with its key) or by order number and email.
 */
class ConfirmPaymentController
{
    public function show(Request $request, OrderAccess $access): View|RedirectResponse
    {
        $key = (string) $request->query('order', '');
        if ($key === '') {
            // Which order? Each one's page has the link here.
            return redirect(commerce_url('commerce.account.orders'));
        }
        $order = $access->find($request, $key);
        $payment = $order->payments()->where('status', 'pending')->reorder('id', 'desc')->first();

        return view(Layout::view('confirm-payment'), [
            'order' => $order,
            'payment' => $payment,
            'accounts' => (array) ($payment->instructions['accounts'] ?? []),
            'proofRequired' => ($payment->instructions['confirmation'] ?? null) === 'required',
            'captcha' => app(Captcha::class)->widget(app()->getLocale()),
            'seoTitle' => __('commerce::payments.confirm.title'),
        ]);
    }

    public function submit(Request $request, SubmitPaymentConfirmation $submit, OrderAccess $access): RedirectResponse
    {
        $key = (string) $request->input('order');
        $order = $access->find($request, $key);
        if (! app(Captcha::class)->passes($request)) {
            return back()->withInput()->withErrors(['captcha' => __('commerce::payments.confirm.captcha')]);
        }
        $submit->handle($order, $request->except(['order', 'proof']), $request->file('proof'), $request->ip());

        return redirect($order->url())->with('commerce.success', __('commerce::payments.confirm.thanks'));
    }
}
