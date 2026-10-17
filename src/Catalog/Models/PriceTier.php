<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A product's own bulk price: from min_qty units, percent_off (basis
 * points), amount_off or fixed_price (minor units) per unit.
 *
 * @property int $id
 * @property int $product_id
 * @property int|null $variant_id
 * @property int $min_qty
 * @property string $type
 * @property int $value
 * @property int $position
 */
class PriceTier extends Model
{
    public const TYPES = ['percent_off', 'amount_off', 'fixed_price'];

    protected $table = 'commerce_price_tiers';

    protected $guarded = [];

    protected $casts = ['value' => 'integer', 'min_qty' => 'integer'];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class);
    }
}
