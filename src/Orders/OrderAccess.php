<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * Who may open an order's pages (/order/{key}, its pay page, invoice,
 * payment confirmation): the account it belongs to, signed in. The key in
 * the address names the order; it never opens it by itself.
 */
final class OrderAccess
{
    public function allows(Request $request, Order $order): bool
    {
        $user = commerce_customer();

        return $user !== null && $order->user_id !== null && (int) $user->getAuthIdentifier() === (int) $order->user_id;
    }

    /** The order with this key, for its account; "not found" for anyone else. */
    public function find(Request $request, string $key): Order
    {
        abort_unless(strlen($key) === 40, 404);
        $order = Order::query()->where('order_key', $key)->first();
        abort_unless($order !== null && $this->allows($request, $order), 404);

        return $order;
    }
}
