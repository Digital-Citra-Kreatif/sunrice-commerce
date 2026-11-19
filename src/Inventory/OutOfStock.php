<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Inventory;

use RuntimeException;
use Sunrice\Commerce\Catalog\Availability;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * A reservation found too little stock; nothing was taken. getMessage() is
 * for logs and staff (ids and SKU); customerMessage() is for the storefront.
 */
class OutOfStock extends RuntimeException
{
    public function __construct(public readonly Variant $variant, public readonly int $requested, public readonly int $available)
    {
        parent::__construct("Not enough stock of variant {$variant->id} ({$variant->sku}): {$requested} requested, {$available} available.");
    }

    /**
     * "Only 2 of Mug (M) left." or "Mug (M) is out of stock.", in the current
     * language, like the cart says it.
     */
    public function customerMessage(): string
    {
        $title = $this->variant->loadMissing('product')->product->entry()?->shownIn()?->title;
        if (blank($title)) {
            return __('commerce::storefront.availability.stock_changed');
        }
        $label = $this->variant->title !== '' ? $title.' ('.$this->variant->title.')' : $title;

        return (new Availability('out_of_stock', ['available' => $this->available]))->message($label);
    }
}
