<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * A line of an order, a snapshot of what was bought. Bundle components
 * are child items (parent_id) with a zero price.
 *
 * @property int $id
 * @property int $order_id
 * @property int|null $parent_id
 * @property int|null $product_id
 * @property int|null $variant_id
 * @property int|null $entry_id
 * @property int|null $flash_sale_item_id
 * @property string $name
 * @property string|null $variant_title
 * @property string|null $sku
 * @property array<string, string>|null $options
 * @property int $quantity
 * @property int $unit_price
 * @property int $regular_unit_price
 * @property int|null $compare_at_price
 * @property array{type: string, id?: int|string|null, label?: string|null}|null $price_source
 * @property int $subtotal
 * @property int $discount_total
 * @property int $tax_total
 * @property int $total
 * @property int|null $cost
 * @property int $weight
 * @property bool $requires_shipping
 * @property bool $downloadable
 * @property int $fulfilled_quantity
 * @property int $refunded_quantity
 * @property array<string, mixed>|null $meta
 * @property-read Order $order
 * @property-read Variant|null $variant
 * @property-read Product|null $product
 * @property-read Collection<int, OrderItem> $children
 */
class OrderItem extends Model
{
    protected $table = 'commerce_order_items';

    protected $guarded = [];

    protected $casts = [
        'options' => 'array',
        'price_source' => 'array',
        'meta' => 'array',
        'requires_shipping' => 'boolean',
        'downloadable' => 'boolean',
        'unit_price' => 'integer',
        'regular_unit_price' => 'integer',
        'subtotal' => 'integer',
        'discount_total' => 'integer',
        'tax_total' => 'integer',
        'total' => 'integer',
        'quantity' => 'integer',
        'fulfilled_quantity' => 'integer',
        'refunded_quantity' => 'integer',
    ];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class)->withTrashed();
    }

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return HasMany<OrderItem, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'parent_id')->orderBy('id');
    }

    public function title(): string
    {
        return trim($this->name.($this->variant_title ? ' ('.$this->variant_title.')' : ''));
    }

    /** Units still to ship. */
    public function unfulfilled(): int
    {
        return $this->requires_shipping ? max(0, $this->quantity - $this->refunded_quantity - $this->fulfilled_quantity) : 0;
    }
}
