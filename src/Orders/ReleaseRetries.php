<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Sunrice\Commerce\Orders\Listeners\ReleaseReservations;
use Sunrice\Commerce\Orders\Models\Order;
use Throwable;

/**
 * commerce:tick: a cancelled order whose reservations weren't all given
 * back (the release failed: a deadlock, an extension's error) is released
 * again, for 30 days after it was cancelled. Each part runs once, so the
 * parts already given back stay given back.
 */
class ReleaseRetries
{
    public function __invoke(): int
    {
        $count = 0;
        Order::withTrashed()->where('status', OrderStatus::CANCELLED)->where('cancelled_at', '>=', now()->subDays(30))
            ->where('cancelled_at', '<=', now()->subMinute())   // the listener's own run first
            ->whereNull('meta->released->done')->orderBy('id')->limit(100)->get()
            ->each(function (Order $order) use (&$count): void {
                try {
                    app(ReleaseReservations::class)->release($order);
                    $count++;
                } catch (Throwable $e) {
                    report($e);
                }
            });

        return $count;
    }
}
