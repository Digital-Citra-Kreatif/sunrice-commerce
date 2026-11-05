<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Storefront;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Customers\CurrentCustomer;
use Sunrice\Commerce\StockAlerts\Actions\SubscribeToStockAlert;

/** POST /stock-alerts: "email me when it's back" for a sold-out variant (honeypot, 20 an hour per address). */
class StockAlertsController extends Controller
{
    public function store(Request $request, CurrentCustomer $current, SubscribeToStockAlert $subscribe): RedirectResponse|JsonResponse
    {
        $customer = $current->get();
        $data = $request->validate([
            'variant' => ['required', 'integer'],
            'email' => [$customer === null ? 'required' : 'nullable', 'email', 'max:255'],
        ]);
        $variant = Variant::query()->with('product')->find($data['variant']);
        abort_if($variant === null, 404);
        $subscribe->handle($variant, (string) ($customer->email ?? $data['email']), $customer);
        $message = __('commerce::storefront.stock_alert.saved');

        return $request->expectsJson() ? response()->json(['message' => $message]) : back()->with('commerce.success', $message);
    }
}
