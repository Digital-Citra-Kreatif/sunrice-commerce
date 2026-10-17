<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Sunrice\Commerce\Storefront\Layout;

/** The customer's quote page (by key): the request, and once quoted, accept or decline. */
class QuoteController
{
    public function show(Request $request, string $key, OrderController $orders): View
    {
        $order = $orders->find($key, 'quote');

        return view(Layout::view('order'), $orders->data($request, $order) + ['seoTitle' => __('commerce::checkout.order.quote_title', ['number' => $order->displayNumber()])]);
    }
}
