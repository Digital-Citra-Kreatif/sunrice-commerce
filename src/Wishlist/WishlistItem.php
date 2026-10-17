<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Wishlist;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sunrice\Commerce\Catalog\Models\Product;

/**
 * @property int $id
 * @property int $wishlist_id
 * @property int $product_id
 * @property int|null $variant_id
 * @property-read Product $product
 */
class WishlistItem extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'commerce_wishlist_items';

    protected $guarded = [];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
