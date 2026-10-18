<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Settings\StoreSettings;

/** A customer cancels their own order: only with the setting on, and only before paying. */
class CancelOrderByCustomer
{
    public function __construct(protected StoreSettings $settings, protected OrderStateMachine $states) {}

    public function allowed(Order $order): bool
    {
        return ! $order->isQuote()
            && (bool) $this->settings->get('checkout.customer_cancel', true)
            && in_array($order->status, [OrderStatus::PENDING, OrderStatus::FAILED], true)
            && in_array($order->payment_status, [OrderStatus::UNPAID, OrderStatus::PAYMENT_FAILED], true)
            && $order->paid_total === 0;
    }

    /** @throws InvalidTransition */
    public function handle(Order $order, ?string $reason = null): Order
    {
        if (! $this->allowed($order)) {
            throw new InvalidTransition($order->status, OrderStatus::CANCELLED, __('commerce::checkout.order.cannot_cancel'));
        }

        return $this->states->transition($order, OrderStatus::CANCELLED, Actor::customer(), $reason ?: __('commerce::orders.timeline.customer_cancelled'));
    }
}
