<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use RuntimeException;

/**
 * The order wasn't placed: what the customer would pay changed since they
 * saw it (a price, a sale ending, a voucher, shipping, stock). Checkout
 * shows the changes and the new totals.
 */
class CheckoutChanged extends RuntimeException
{
    /** @param  array<int, string>  $changes */
    public function __construct(public readonly array $changes)
    {
        parent::__construct(__('commerce::checkout.errors.changed'));
    }
}
