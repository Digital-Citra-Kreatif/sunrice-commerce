<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;

class FlashSaleEnded
{
    use Dispatchable;

    public function __construct(public readonly FlashSale $sale) {}
}
