<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Returns;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Returns\Models\ReturnItem;
use Sunrice\Commerce\Returns\Models\ReturnRequest;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Which orders and how much of them can be returned: a completed order,
 * within `checkout.returns_days` of its completion (0: no returns), and
 * of each line what isn't in another return (rejected ones aside).
 */
class Returns
{
    public function __construct(protected StoreSettings $settings) {}

    public function open(Order $order): bool
    {
        $days = (int) $this->settings->get('checkout.returns_days', 14);
        $since = $order->completed_at ?? $order->paid_at;

        return commerce_feature('returns') && $days > 0 && $order->type === 'order' && $order->status === OrderStatus::COMPLETED
            && $since !== null && $since->copy()->addDays($days)->isFuture() && $this->returnable($order) !== [];
    }

    /**
     * What's left to return of each line: order item id => quantity.
     *
     * @return array<int, int>
     */
    public function returnable(Order $order): array
    {
        $taken = ReturnItem::query()->whereHas('returnRequest', fn ($q) => $q->where('order_id', $order->id)->whereIn('status', ReturnRequest::OPEN))
            ->groupBy('order_item_id')->selectRaw('order_item_id, sum(quantity) as total')->pluck('total', 'order_item_id');
        $left = [];
        foreach ($order->items()->whereNull('parent_id')->get() as $item) {
            $qty = (int) $item->quantity - (int) ($taken[$item->id] ?? 0);
            if ($qty > 0) {
                $left[$item->id] = $qty;
            }
        }

        return $left;
    }
}
