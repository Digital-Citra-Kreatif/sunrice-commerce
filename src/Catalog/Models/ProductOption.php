<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * An option of a variable product (Size, Color), custom or a global attribute taxonomy.
 *
 * @property int $id
 * @property int $product_id
 * @property string $uid
 * @property string $name
 * @property int|null $taxonomy_id
 * @property int $position
 */
class ProductOption extends Model
{
    protected $table = 'commerce_product_options';

    protected $guarded = [];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return HasMany<ProductOptionValue, $this> */
    public function values(): HasMany
    {
        return $this->hasMany(ProductOptionValue::class, 'option_id')->orderBy('position');
    }
}
