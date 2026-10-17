<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A change of an order's total: discounts (negative), shipping discounts,
 * fees, taxes, the unique transfer code, manual changes.
 *
 * @property int $id
 * @property int $order_id
 * @property int|null $order_item_id
 * @property string $kind discount | shipping_discount | fee | tax | unique_code | manual
 * @property string $source_type
 * @property string|null $source_id
 * @property string|null $code
 * @property string|null $label
 * @property int $amount signed: negative lowers the total
 * @property array<string, mixed>|null $meta
 * @property Carbon|null $created_at
 */
class OrderAdjustment extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'commerce_order_adjustments';

    protected $guarded = [];

    protected $casts = ['meta' => 'array', 'amount' => 'integer'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
