<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\Actions\AcceptQuote;
use Sunrice\Commerce\Orders\Actions\DeclineQuote;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Storefront\Layout;
use Sunrice\Commerce\Support\DomainException;

/** The customer's quote page (by key): the request, and once quoted, accept or decline. */
class QuoteController
{
    public function show(Request $request, string $key, OrderController $orders): View|RedirectResponse
    {
        $order = $orders->find($key, 'quote');
        if (! $order->isQuote()) {
            return redirect($order->url());
        }

        return view(Layout::view('order'), $orders->data($request, $order) + ['seoTitle' => __('commerce::checkout.order.quote_title', ['number' => $order->displayNumber()])]);
    }

    public function accept(string $key, OrderController $orders, AcceptQuote $accept): RedirectResponse
    {
        $quote = $orders->find($key, 'quote');
        try {
            $order = $accept->handle($quote, Actor::customer());
        } catch (DomainException $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return redirect($order->url())->with('commerce.success', __('commerce::checkout.quote.accepted', ['number' => $order->number]));
    }

    public function decline(Request $request, string $key, OrderController $orders, DeclineQuote $decline): RedirectResponse
    {
        $quote = $orders->find($key, 'quote');
        try {
            $decline->handle($quote, Actor::customer(), $request->string('reason')->limit(250)->toString() ?: null);
        } catch (DomainException $e) {
            return back()->with('commerce.error', $e->getMessage());
        }

        return back()->with('commerce.success', __('commerce::checkout.quote.declined'));
    }
}
