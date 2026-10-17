<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Catalog\Models\Product;

/** Projecting a product entry failed; the product isn't purchasable until fixed. */
class ProductSyncFailed
{
    use Dispatchable;

    public function __construct(public readonly Product $product, public readonly string $error) {}
}
