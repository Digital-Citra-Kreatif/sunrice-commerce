<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Sunrice\Commerce\Catalog\Models\Variant;

/** Price adjusters and view extenders registered for ProductViewFactory. */
class ProductViewHooks
{
    /** @var array<int, Closure(Variant, int): int> */
    public array $priceAdjusters = [];

    /** @var array<int, Closure(ProductView): ProductView> */
    public array $extenders = [];
}
