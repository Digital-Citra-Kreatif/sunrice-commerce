<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Cart\Models\Cart;

class VoucherApplied
{
    use Dispatchable;

    public function __construct(public readonly Cart $cart, public readonly string $code) {}
}
