<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Listeners;

use Sunrice\Commerce\Loyalty\Loyalty;
use Sunrice\Commerce\Orders\Events\OrderCompleted;

/** A completed order earns its points (once). */
class EarnPoints
{
    public function __construct(protected Loyalty $loyalty) {}

    public function handle(OrderCompleted $event): void
    {
        $this->loyalty->earn($event->order->fresh() ?? $event->order);
    }
}
