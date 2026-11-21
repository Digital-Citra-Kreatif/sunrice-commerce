<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Listeners;

use Sunrice\Commerce\Loyalty\GiftCards;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Orders\Events\OrderPaid;

/**
 * A paid order's gift card lines become codes: all of them emailed to the customer ("gift_card_issued"),
 * and each one with a recipient to that person too ("gift_card_received"). Once per line.
 */
class IssueGiftCards
{
    public function __construct(protected GiftCards $cards, protected Notifier $notifier) {}

    public function handle(OrderPaid $event): void
    {
        if (! commerce_feature('loyalty')) {
            return;
        }
        $cards = $this->cards->issueFor($event->order);
        foreach ($cards as $card) {
            $this->cards->send($card);
        }
        if ($cards !== []) {
            $this->notifier->send('gift_card_issued', $event->order->fresh(), ['gift_cards' => $cards]);
        }
    }
}
