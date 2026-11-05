<?php

declare(strict_types=1);

namespace Sunrice\Commerce\StockAlerts\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * "Email me when it's back": one address waiting for a sold-out variant,
 * emailed once when it can be bought again.
 *
 * @property int $id
 * @property int $product_id
 * @property int $variant_id
 * @property string $email
 * @property int|null $customer_id
 * @property string|null $locale
 * @property Carbon|null $notified_at
 * @property Carbon|null $created_at
 * @property-read Product $product
 * @property-read Variant $variant
 */
class StockAlert extends Model
{
    protected $table = 'commerce_stock_alerts';

    protected $guarded = [];

    protected $casts = ['notified_at' => 'datetime'];

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
