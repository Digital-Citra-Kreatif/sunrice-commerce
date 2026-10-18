<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Analytics\Listeners;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Analytics\Jobs\RecomputeStatsDay;
use Sunrice\Commerce\Cart\Events\CartItemAdded;
use Sunrice\Commerce\Checkout\Events\CheckoutStarted;
use Sunrice\Commerce\Contracts\Tracking;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Orders\Events;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * Order changes queue a recompute of the days they touch: the day the
 * order was placed and the days of its refunds (a cancellation removes
 * both). Cart and checkout events are counted directly.
 */
class QueueStatsRecompute
{
    public function subscribe(Dispatcher $events): void
    {
        foreach ([Events\OrderPlaced::class, Events\OrderPaid::class, Events\OrderStatusChanged::class, Events\OrderEdited::class, Events\OrderRefunded::class, Events\QuoteRequested::class] as $event) {
            $events->listen($event, fn (object $e) => $this->order($e->order));
        }
        $events->listen(CartItemAdded::class, fn (CartItemAdded $e) => app(Tracking::class)->track('add_to_cart', $e->item->variant->product_id));
        $events->listen(CheckoutStarted::class, fn () => app(Tracking::class)->track('checkout_started'));
    }

    public function order(Order $order): void
    {
        if (! app(Features::class)->active('analytics')) {
            return;
        }
        $days = [Day::of($order->isQuote() ? $order->created_at : ($order->placed_at ?? $order->created_at))];
        foreach (DB::table('commerce_refunds')->where('order_id', $order->id)->pluck('created_at') as $at) {
            $days[] = Day::of((string) $at);
        }
        foreach (array_unique($days) as $day) {
            RecomputeStatsDay::dispatch($day);
        }
    }
}
