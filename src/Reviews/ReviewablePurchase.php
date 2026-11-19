<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews;

use Illuminate\Database\Eloquent\Builder;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;

final class ReviewablePurchase
{
    /** @return Builder<Order> */
    public static function forProduct(Product $product): Builder
    {
        return Order::query()->where('type', 'order')
            ->whereIn('status', [OrderStatus::PROCESSING, OrderStatus::COMPLETED])
            ->where('payment_status', OrderStatus::PAID)
            ->whereHas('items', fn ($items) => $items->where('product_id', $product->id));
    }
}
