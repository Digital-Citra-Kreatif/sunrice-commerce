<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A component of a bundle product.
 *
 * @property int $id
 * @property int $product_id
 * @property int $variant_id
 * @property int $quantity
 * @property int $position
 * @property-read Variant $variant
 */
class BundleItem extends Model
{
    protected $table = 'commerce_bundle_items';

    protected $guarded = [];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class)->withTrashed();
    }
}
