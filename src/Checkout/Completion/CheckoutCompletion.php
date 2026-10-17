<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Completion;

use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Pricing\CalculationState;

/**
 * How a checkout ends in a selling mode (ARCHITECTURE.md §11.2): an
 * order, a quote request or a WhatsApp order. Packages add strategies
 * with Commerce::registerCheckoutCompletion().
 */
interface CheckoutCompletion
{
    /** 'order' | 'quote' | 'whatsapp' */
    public static function key(): string;

    /** 'order' | 'quote' */
    public function orderType(): string;

    public function requiresPayment(): bool;

    public function initialStates(CalculationState $state, CheckoutData $data): OrderStates;

    public function reservesStock(): bool;

    /** Where the customer goes once it's placed. */
    public function afterPlaced(Order $order): CompletionResponse;
}
