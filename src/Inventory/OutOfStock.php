<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Inventory;

use RuntimeException;
use Sunrice\Commerce\Catalog\Models\Variant;

/** A reservation found too little stock; nothing was taken. */
class OutOfStock extends RuntimeException
{
    public function __construct(public readonly Variant $variant, public readonly int $requested, public readonly int $available)
    {
        parent::__construct("Not enough stock of variant {$variant->id} ({$variant->sku}): {$requested} requested, {$available} available.");
    }
}
