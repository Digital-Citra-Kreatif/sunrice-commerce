<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Listeners;

use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\ShipmentCreated;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Completes orders by the settings: paid orders with nothing to ship
 * (checkout.auto_complete_digital), and fully shipped paid orders
 * (checkout.auto_complete_shipped).
 */
class AutoCompleteOrder
{
    public function __construct(protected StoreSettings $settings, protected OrderStateMachine $states) {}

    public function handle(OrderPaid|ShipmentCreated $event): void
    {
        $order = $event->order->fresh();
        if ($order === null || $order->status !== OrderStatus::PROCESSING) {
            return;
        }
        $complete = ($order->fulfillment_status === OrderStatus::NOT_REQUIRED && $this->settings->get('checkout.auto_complete_digital', true))
            || ($order->fulfillment_status === OrderStatus::SHIPPED && $this->settings->get('checkout.auto_complete_shipped', false));
        if ($complete && $this->states->can($order, OrderStatus::COMPLETED)) {
            $this->states->transition($order, OrderStatus::COMPLETED, Actor::system());
        }
    }
}
