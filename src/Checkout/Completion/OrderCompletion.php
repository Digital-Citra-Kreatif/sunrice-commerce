<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Pricing\CalculationState;

/** Online store: Pending payment, or Processing for a zero total and cash on delivery. */
class OrderCompletion implements CheckoutCompletion
{
    public static function key(): string
    {
        return 'order';
    }

    public function orderType(): string
    {
        return 'order';
    }

    public function requiresPayment(): bool
    {
        return true;
    }

    public function initialStates(CalculationState $state, CheckoutData $data): OrderStates
    {
        $fulfillment = $state->shipping['needed'] ? OrderStatus::UNFULFILLED : OrderStatus::NOT_REQUIRED;
        if ($state->totals['total'] === 0) {
            return new OrderStates(OrderStatus::PROCESSING, OrderStatus::PAID, $fulfillment);
        }
        if ($data->paymentMethod() === 'cod') {
            return new OrderStates(OrderStatus::PROCESSING, OrderStatus::UNPAID, $fulfillment);
        }

        return new OrderStates(OrderStatus::PENDING, OrderStatus::UNPAID, $fulfillment);
    }

    public function reservesStock(): bool
    {
        return true;
    }

    public function afterPlaced(Order $order): CompletionResponse
    {
        return new CompletionResponse($order->url());
    }
}
