<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Cart\Models\CartItem;

class CartItemRemoved
{
    use Dispatchable;

    public function __construct(public readonly CartItem $item) {}
}
