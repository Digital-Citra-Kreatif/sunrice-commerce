<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Catalog\Models\Product;

/** A product entry's value was projected into the commerce tables. */
class ProductSynced
{
    use Dispatchable;

    public function __construct(public readonly Product $product) {}
}
