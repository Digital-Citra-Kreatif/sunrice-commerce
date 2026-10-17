<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Checkout\WhatsAppMessage;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Pricing\CalculationState;

/**
 * WhatsApp order: Pending, payment "Arranged via WhatsApp"; the order page
 * opens WhatsApp with the order message (the number and link are kept on
 * the order, so a reload doesn't rotate to another number).
 */
class WhatsAppCompletion implements CheckoutCompletion
{
    public function __construct(protected WhatsAppMessage $message) {}

    public static function key(): string
    {
        return 'whatsapp';
    }

    public function orderType(): string
    {
        return 'order';
    }

    public function requiresPayment(): bool
    {
        return false;
    }

    public function initialStates(CalculationState $state, CheckoutData $data): OrderStates
    {
        return new OrderStates(OrderStatus::PENDING, OrderStatus::UNPAID, $state->shipping['needed'] ? OrderStatus::UNFULFILLED : OrderStatus::NOT_REQUIRED);
    }

    public function reservesStock(): bool
    {
        return true;
    }

    public function afterPlaced(Order $order): CompletionResponse
    {
        $url = $this->message->url($order);
        if ($url !== null) {
            $order->setMeta('whatsapp_url', $url)->save();
        }

        return new CompletionResponse($order->url().'?whatsapp=1');
    }
}
