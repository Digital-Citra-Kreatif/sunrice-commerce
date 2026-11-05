<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Returns\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sunrice\Commerce\Orders\Models\OrderItem;

/**
 * @property int $id
 * @property int $return_id
 * @property int $order_item_id
 * @property int $quantity
 * @property-read OrderItem $orderItem
 */
class ReturnItem extends Model
{
    public $timestamps = false;

    protected $table = 'commerce_return_items';

    protected $guarded = [];

    protected $casts = ['quantity' => 'integer'];

    /** @return BelongsTo<ReturnRequest, $this> */
    public function returnRequest(): BelongsTo
    {
        return $this->belongsTo(ReturnRequest::class, 'return_id');
    }

    /** @return BelongsTo<OrderItem, $this> */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
