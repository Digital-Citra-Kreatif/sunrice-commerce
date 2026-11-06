<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Listeners;

use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Loyalty\Models\LoyaltyTransaction;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Models\Order;

/** The customer's order count and spend, recomputed from their paid orders (so repeats don't double count). */
class UpdateCustomerStats
{
    public function handle(OrderPaid|OrderRefunded|OrderCancelled $event): void
    {
        if ($event->order->customer_id !== null) {
            $this->refresh($event->order->customer_id);
        }
    }

    public function refresh(int $customerId): void
    {
        $customer = Customer::query()->find($customerId);
        if ($customer === null) {
            return;
        }
        $orders = Order::query()->where('customer_id', $customerId)->where('type', 'order')->whereNotNull('paid_at');
        $customer->forceFill([
            'orders_count' => (clone $orders)->count(),
            // What points paid counts too, less what went back onto the wallet.
            'total_spent' => (int) (clone $orders)->sum('paid_total') - (int) (clone $orders)->sum('refunded_total')
                - (int) LoyaltyTransaction::query()->whereIn('order_id', (clone $orders)->select('id'))->whereIn('kind', ['redeem', 'release', 'refund'])->sum('points'),
            'first_order_at' => (clone $orders)->min('placed_at'),
            'last_order_at' => (clone $orders)->max('placed_at'),
        ])->save();
    }
}
