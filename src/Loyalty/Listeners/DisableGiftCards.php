<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Listeners;

use Sunrice\Commerce\Loyalty\GiftCards;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderRefunded;

/** An order cancelled, or refunded in full: the gift cards it bought that aren't redeemed yet stop working. */
class DisableGiftCards
{
    public function __construct(protected GiftCards $cards) {}

    public function handle(OrderCancelled|OrderRefunded $event): void
    {
        $order = $event->order->fresh() ?? $event->order;
        if ($event instanceof OrderRefunded && $order->refunded_total < $order->total) {
            return;
        }
        $this->cards->disableFor($order);
    }
}
