<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Listeners;

use Sunrice\Commerce\Loyalty\Loyalty;
use Sunrice\Commerce\Orders\Events\OrderRefunded;

/** A refund takes back its share of the points the order earned. */
class RevokePoints
{
    public function __construct(protected Loyalty $loyalty) {}

    public function handle(OrderRefunded $event): void
    {
        $this->loyalty->revoke($event->order->fresh() ?? $event->order);
    }
}
