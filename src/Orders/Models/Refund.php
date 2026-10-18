<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $order_id
 * @property int|null $payment_id
 * @property int $amount
 * @property string|null $reason
 * @property array<int, array{order_item_id: int, quantity: int, amount?: int}>|null $items
 * @property bool $restock
 * @property string $method manual | gateway
 * @property string|null $reference
 * @property string $status
 * @property int|null $created_by
 * @property Carbon|null $created_at
 */
class Refund extends Model
{
    protected $table = 'commerce_refunds';

    protected $guarded = [];

    protected $casts = ['items' => 'array', 'restock' => 'boolean', 'amount' => 'integer'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
