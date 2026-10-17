<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\OrderStatus;

/**
 * The orders that count as sales (SPEC.md, analytics definitions): paid,
 * or Processing or Completed (cash on delivery), by placement date.
 * Quotes, cancelled and failed orders and trashed orders never count, nor
 * do their refunds.
 */
final class CountedOrders
{
    public const PAID = [OrderStatus::PAID, OrderStatus::PARTIALLY_REFUNDED, OrderStatus::PAYMENT_REFUNDED];

    public static function query(): Builder
    {
        return DB::table('commerce_orders')
            ->where('commerce_orders.type', 'order')
            ->whereNull('commerce_orders.deleted_at')
            ->whereNotNull('commerce_orders.placed_at')
            ->whereNotIn('commerce_orders.status', [OrderStatus::CANCELLED, OrderStatus::FAILED])
            ->where(fn (Builder $q) => $q->whereIn('commerce_orders.payment_status', self::PAID)->orWhereIn('commerce_orders.status', [OrderStatus::PROCESSING, OrderStatus::COMPLETED]));
    }

    /** Counted orders placed between two local dates, inclusive. */
    public static function between(string $from, string $to): Builder
    {
        return self::query()->where('commerce_orders.placed_at', '>=', Day::bounds($from)[0])->where('commerce_orders.placed_at', '<', Day::bounds($to)[1]);
    }
}
