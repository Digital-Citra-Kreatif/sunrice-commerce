<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderEvent;
use Sunrice\Commerce\Orders\Timeline;

/** A staff note on the timeline: internal, or to the customer (emailed by the OrderNoteAdded listener). */
class AddOrderNote
{
    public function __construct(protected Timeline $timeline) {}

    public function handle(Order $order, string $message, bool $toCustomer, Actor $actor): OrderEvent
    {
        return $this->timeline->note($order, trim($message), $toCustomer, $actor);
    }
}
