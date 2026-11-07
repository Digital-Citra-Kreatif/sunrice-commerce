<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Inventory;

use RuntimeException;
use Sunrice\Cms\Support\Locales;
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
        return (new Availability('out_of_stock', ['available' => $this->available]))->message($this->productTitle());
    }

    protected function productTitle(): string
    {
        $entry = $this->variant->loadMissing('product')->product?->entry();
        $translation = $entry?->translation(Locales::current()) ?? $entry?->mainTranslation();
        $title = (string) ($translation->title ?? $translation->draft_title ?? $this->variant->sku ?? '');

        return trim($title.((string) $this->variant->title !== '' ? ' ('.$this->variant->title.')' : ''));
    }
}
