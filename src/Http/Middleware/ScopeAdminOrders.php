<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\AdminOrderScopes;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;
use Symfony\Component\HttpFoundation\Response;

/** The admin's order and confirmation pages answer 404 for an order outside the staff member's scope (AdminOrderScopes). */
final class ScopeAdminOrders
{
    public function handle(Request $request, Closure $next): Response
    {
        $scopes = app(AdminOrderScopes::class);
        if ($scopes->scoped()) {
            $order = $request->route('order');
            $confirmation = $request->route('confirmation');
            $id = match (true) {
                $order instanceof Order => $order->id,
                is_numeric($order) => (int) $order,
                $confirmation instanceof PaymentConfirmation => $confirmation->order_id,
                is_numeric($confirmation) => (int) PaymentConfirmation::query()->whereKey((int) $confirmation)->value('order_id'),
                default => null,
            };
            abort_if($id !== null && ! $scopes->allows($id), 404);
        }

        return $next($request);
    }
}
