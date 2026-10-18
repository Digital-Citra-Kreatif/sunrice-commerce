<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Contracts;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Pricing\CalculationState;

/**
 * A discount provider (or shipping discount or fee provider) that holds
 * something back for an order: loyalty points, gift card balance,
 * cashback (ARCHITECTURE.md §24.2).
 */
interface ReservesDiscounts
{
    /**
     * Inside PlaceOrder's transaction, after stock, flash sales and
     * vouchers: reserve what this provider gave in $state (its own
     * adjustments). Throw Checkout\CheckoutRefused to refuse the order.
     */
    public function commit(Order $order, CalculationState $state): void;

    /** The order was cancelled (or expired unpaid): give back what commit() reserved. Runs once per order. */
    public function release(Order $order): void;
}
