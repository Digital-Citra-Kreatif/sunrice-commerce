<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Sunrice\Commerce\Database\Factories\VariantFactory;

/**
 * What is actually sold: a simple product has one variant, a variable
 * product one per option combination. Soft-deleted when removed from the
 * product, so order lines keep pointing at it.
 *
 * @property int $id
 * @property int $product_id
 * @property string $uid
 * @property string|null $sku
 * @property string|null $barcode
 * @property string $title
 * @property int $price
 * @property int|null $compare_at_price
 * @property int|null $cost
 * @property int|null $weight grams
 * @property int|null $length millimetres
 * @property int|null $width millimetres
 * @property int|null $height millimetres
 * @property int|null $image_asset_id
 * @property bool|null $requires_shipping
 * @property bool|null $downloadable
 * @property bool $track_stock
 * @property int|null $stock_quantity
 * @property string $stock_status
 * @property string $backorders
 * @property int|null $low_stock_threshold
 * @property int $min_qty
 * @property int|null $max_qty
 * @property int $qty_step
 * @property int $position
 * @property bool $is_default
 * @property bool $active
 * @property-read Product $product
 */
class Variant extends Model
{
    /** @use HasFactory<VariantFactory> */
    use HasFactory, SoftDeletes;

    public const STOCK_STATUSES = ['in_stock', 'out_of_stock', 'backorder'];

    public const BACKORDERS = ['no', 'allow', 'notify'];

    protected $table = 'commerce_variants';

    protected $guarded = [];

    protected $casts = [
        'price' => 'integer',
        'compare_at_price' => 'integer',
        'cost' => 'integer',
        'stock_quantity' => 'integer',
        'requires_shipping' => 'boolean',
        'downloadable' => 'boolean',
        'track_stock' => 'boolean',
        'is_default' => 'boolean',
        'active' => 'boolean',
    ];

    protected static function newFactory(): VariantFactory
    {
        return VariantFactory::new();
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsToMany<ProductOptionValue, $this> */
    public function optionValues(): BelongsToMany
    {
        return $this->belongsToMany(ProductOptionValue::class, 'commerce_variant_option_values', 'variant_id', 'option_value_id');
    }

    /** @return HasMany<StockMovement, $this> */
    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class)->latest('id');
    }

    /** @return HasMany<DownloadFile, $this> */
    public function downloads(): HasMany
    {
        return $this->hasMany(DownloadFile::class);
    }

    public function requiresShipping(): bool
    {
        return $this->requires_shipping ?? $this->product->requires_shipping;
    }

    public function isDownloadable(): bool
    {
        return $this->downloadable ?? $this->product->downloadable;
    }

    /** On sale by its own compare-at price. */
    public function onSale(): bool
    {
        return $this->compare_at_price !== null && $this->compare_at_price > $this->price;
    }

    /** The status the stock quantity implies (untracked variants keep their manual status). */
    public function computedStockStatus(): string
    {
        if (! $this->track_stock) {
            return in_array($this->stock_status, self::STOCK_STATUSES, true) ? $this->stock_status : 'in_stock';
        }
        if ((int) $this->stock_quantity > 0) {
            return 'in_stock';
        }

        return $this->backorders === 'no' ? 'out_of_stock' : 'backorder';
    }
}
