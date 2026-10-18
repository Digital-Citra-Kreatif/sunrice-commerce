<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * @property int $id
 * @property int $cart_id
 * @property int $variant_id
 * @property int $quantity
 * @property int|null $unit_price_seen
 * @property array<string, mixed>|null $meta
 * @property-read Variant $variant
 */
class CartItem extends Model
{
    protected $table = 'commerce_cart_items';

    protected $guarded = [];

    protected $casts = ['meta' => 'array', 'quantity' => 'integer', 'unit_price_seen' => 'integer'];

    /** @return BelongsTo<Cart, $this> */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class)->withTrashed();
    }
}
