<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\FlashSales;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Promotions\Tiers;

/**
 * A product (every variant) or one variant in a flash sale, with its sale
 * price, quantity cap and units sold.
 *
 * @property int $id
 * @property int $flash_sale_id
 * @property int $product_id
 * @property int|null $variant_id
 * @property string $discount_type percent_off | amount_off | fixed_price
 * @property int $discount_value
 * @property int|null $quantity_limit
 * @property int $sold_quantity
 * @property int|null $per_customer_limit
 * @property int $position
 * @property-read FlashSale $sale
 */
class FlashSaleItem extends Model
{
    protected $table = 'commerce_flash_sale_items';

    protected $guarded = [];

    protected $casts = ['discount_value' => 'integer', 'sold_quantity' => 'integer', 'quantity_limit' => 'integer', 'per_customer_limit' => 'integer'];

    /** @return BelongsTo<FlashSale, $this> */
    public function sale(): BelongsTo
    {
        return $this->belongsTo(FlashSale::class, 'flash_sale_id');
    }

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

    public function priceFor(int $base): int
    {
        return Tiers::apply($base, $this->discount_type, $this->discount_value);
    }

    /** Units left under the cap (null: no cap). */
    public function remaining(): ?int
    {
        return $this->quantity_limit === null ? null : max(0, $this->quantity_limit - $this->sold_quantity);
    }

    /** The per-customer limit: the item's own, else the sale's. */
    public function customerLimit(): ?int
    {
        return $this->per_customer_limit ?? $this->sale->per_customer_limit;
    }
}
