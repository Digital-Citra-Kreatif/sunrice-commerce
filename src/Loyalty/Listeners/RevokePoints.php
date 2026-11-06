<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Listeners;

use Sunrice\Commerce\Loyalty\Loyalty;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Payments\Events\PaymentRecorded;

/**
 * A refund takes back its share of the points the order earned: refunds
 * staff record (OrderRefunded) and those a payment provider reports
 * (PaymentRecorded with a refunded result). Loyalty::revoke() works from
 * the total refunded, so hearing one refund twice takes nothing more.
 */
class RevokePoints
{
    public function __construct(protected Loyalty $loyalty) {}

    public function handle(OrderRefunded|PaymentRecorded $event): void
    {
        if ($event instanceof PaymentRecorded && ! in_array($event->result->status, ['refunded', 'partially_refunded'], true)) {
            return;
        }
        $order = $event instanceof OrderRefunded ? $event->order : Order::withTrashed()->find($event->payment->order_id);
        if ($order !== null) {
            $this->loyalty->revoke($order);
        }
    }
}
