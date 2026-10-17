<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Listeners;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Models\OrderItem;

/** Units sold per product (best-seller sorting): added when paid, taken back for refunded units. Once per order. */
class RecordSalesCount
{
    public function handle(OrderPaid|OrderRefunded $event): void
    {
        $order = $event->order->fresh() ?? $event->order;
        if ($event instanceof OrderPaid) {
            if ($order->meta('sales_counted')) {
                return;
            }
            foreach ($order->items()->whereNull('parent_id')->whereNotNull('product_id')->get() as $item) {
                DB::table('commerce_products')->where('id', $item->product_id)->increment('sales_count', $item->quantity);
            }
            $order->setMeta('sales_counted', true)->saveQuietly();

            return;
        }
        foreach ((array) $event->refund->items as $row) {
            $item = OrderItem::query()->find($row['order_item_id']);
            if ($item?->product_id !== null && $row['quantity'] > 0) {
                DB::table('commerce_products')->where('id', $item->product_id)->where('sales_count', '>=', (int) $row['quantity'])->decrement('sales_count', (int) $row['quantity']);
            }
        }
    }
}
