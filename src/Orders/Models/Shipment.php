<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A parcel sent for an order: courier, tracking and the item quantities in it.
 *
 * @property int $id
 * @property int $order_id
 * @property string|null $courier
 * @property string|null $courier_name
 * @property string|null $service
 * @property string|null $tracking_number
 * @property string|null $tracking_url
 * @property string $status shipped | in_transit | delivered | returned | cancelled
 * @property array<int, array{order_item_id: int, quantity: int}>|null $items
 * @property int|null $cost
 * @property Carbon|null $shipped_at
 * @property Carbon|null $delivered_at
 * @property array<string, mixed>|null $meta
 * @property int|null $created_by
 * @property-read Order $order
 */
class Shipment extends Model
{
    protected $table = 'commerce_shipments';

    protected $guarded = [];

    protected $casts = ['items' => 'array', 'meta' => 'array', 'shipped_at' => 'datetime', 'delivered_at' => 'datetime'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
