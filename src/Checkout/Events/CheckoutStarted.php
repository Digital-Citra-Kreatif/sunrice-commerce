<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Cart\Models\Cart;

/** The first visit to checkout with this cart (analytics: checkouts started). */
class CheckoutStarted
{
    use Dispatchable;

    public function __construct(public Cart $cart) {}
}
