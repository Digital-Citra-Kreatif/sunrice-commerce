<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Illuminate\Http\Request;
use Sunrice\Commerce\Orders\Models\Order;

/** Order references identify a record. Access is granted by ownership or a verified guest session. */
final class OrderAccess
{
    public function allows(Request $request, Order $order): bool
    {
        if ($order->user_id !== null) {
            $user = commerce_customer();

            return $user !== null && (int) $user->getAuthIdentifier() === (int) $order->user_id;
        }

        $grant = $request->session()->get("commerce.orders.{$order->id}");
        if (is_string($grant)) {
            return hash_equals($order->order_key, $grant);
        }

        return is_array($grant)
            && ($grant['until'] ?? 0) >= now()->timestamp
            && is_string($grant['key'] ?? null)
            && hash_equals($order->order_key, $grant['key']);
    }

    public function grantGuest(Request $request, Order $order): void
    {
        if ($order->user_id === null) {
            $request->session()->put("commerce.orders.{$order->id}", [
                'key' => $order->order_key,
                'until' => now()->addHour()->timestamp,
            ]);
        }
    }

    public function find(Request $request, string $key): Order
    {
        abort_unless(strlen($key) === 40, 404);
        $order = Order::query()->where('order_key', $key)->first();
        abort_unless($order !== null && $this->allows($request, $order), 404);

        return $order;
    }
}
