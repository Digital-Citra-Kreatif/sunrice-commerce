<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Database\Factories\ProductFactory;
use Sunrice\Models\Entry;

/**
 * The commerce projection of a product entry (ProductProjector): the
 * entry's `product` field value as rows, plus the price/stock index.
 *
 * @property int $id
 * @property int $entry_id
 * @property int $collection_id
 * @property string $type
 * @property string $purchase_mode
 * @property array<int, array<string, mixed>>|null $external_links
 * @property bool $requires_shipping
 * @property bool $downloadable
 * @property bool $featured
 * @property string|null $tax_class
 * @property string|null $bundle_pricing
 * @property int|null $bundle_value
 * @property array<string, mixed>|null $delivery
 * @property int|null $min_price
 * @property int|null $max_price
 * @property int|null $min_regular_price
 * @property int|null $max_regular_price
 * @property bool $on_sale
 * @property bool $in_stock
 * @property int $sales_count
 * @property string|null $data_hash
 * @property string $sync_status
 * @property string|null $sync_error
 * @property Carbon|null $synced_at
 * @property Carbon|null $removed_at
 */
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    public const TYPES = ['simple', 'variable', 'bundle'];

    public const PURCHASE_MODES = ['default', 'cart', 'inquiry', 'whatsapp', 'external', 'none'];

    protected $table = 'commerce_products';

    protected $guarded = [];

    protected $casts = [
        'external_links' => 'array',
        'delivery' => 'array',
        'requires_shipping' => 'boolean',
        'downloadable' => 'boolean',
        'featured' => 'boolean',
        'on_sale' => 'boolean',
        'in_stock' => 'boolean',
        'bundle_value' => 'integer',
        'min_price' => 'integer',
        'max_price' => 'integer',
        'min_regular_price' => 'integer',
        'max_regular_price' => 'integer',
        'synced_at' => 'datetime',
        'removed_at' => 'datetime',
    ];

    protected static function newFactory(): ProductFactory
    {
        return ProductFactory::new();
    }

    /** @return HasMany<ProductOption, $this> */
    public function options(): HasMany
    {
        return $this->hasMany(ProductOption::class)->orderBy('position');
    }

    /** @return HasMany<Variant, $this> */
    public function variants(): HasMany
    {
        return $this->hasMany(Variant::class)->orderBy('position');
    }

    /** @return HasMany<Variant, $this> */
    public function activeVariants(): HasMany
    {
        return $this->variants()->where('active', true);
    }

    /** @return HasMany<BundleItem, $this> */
    public function bundleItems(): HasMany
    {
        return $this->hasMany(BundleItem::class)->orderBy('position');
    }

    /** @return HasMany<PriceTier, $this> */
    public function tiers(): HasMany
    {
        return $this->hasMany(PriceTier::class)->orderBy('min_qty');
    }

    /** @return HasMany<DownloadFile, $this> */
    public function downloads(): HasMany
    {
        return $this->hasMany(DownloadFile::class);
    }

    /** The Sunrice entry, whatever its state (drafts and trash included). */
    public function entry(): ?Entry
    {
        return Entry::withTrashed()->find($this->entry_id);
    }

    public function isVariable(): bool
    {
        return $this->type === 'variable';
    }

    public function isBundle(): bool
    {
        return $this->type === 'bundle';
    }

    public function syncFailed(): bool
    {
        return $this->sync_status === 'failed';
    }
}
