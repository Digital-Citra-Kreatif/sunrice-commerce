<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Cart\Models\Cart;

class CartMerged
{
    use Dispatchable;

    public function __construct(public readonly Cart $guest, public readonly Cart $into) {}
}
