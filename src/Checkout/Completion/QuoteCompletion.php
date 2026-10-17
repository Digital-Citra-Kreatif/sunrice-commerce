<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Pricing\CalculationState;

/** Quotation: a quote request; nothing is reserved until it is accepted. */
class QuoteCompletion implements CheckoutCompletion
{
    public static function key(): string
    {
        return 'quote';
    }

    public function orderType(): string
    {
        return 'quote';
    }

    public function requiresPayment(): bool
    {
        return false;
    }

    public function initialStates(CalculationState $state, CheckoutData $data): OrderStates
    {
        return new OrderStates(OrderStatus::REQUESTED, OrderStatus::UNPAID, $state->shipping['needed'] ? OrderStatus::UNFULFILLED : OrderStatus::NOT_REQUIRED);
    }

    public function reservesStock(): bool
    {
        return false;
    }

    public function afterPlaced(Order $order): CompletionResponse
    {
        return new CompletionResponse($order->url());
    }
}
