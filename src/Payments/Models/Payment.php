<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * One attempt to pay an order with a method. Only RecordPaymentResult
 * changes its status.
 *
 * @property int $id
 * @property int $order_id
 * @property string $method
 * @property string|null $method_title
 * @property int $amount
 * @property string $currency
 * @property string $status pending | awaiting_confirmation | paid | failed | expired | cancelled | refunded | partially_refunded
 * @property string|null $reference
 * @property array<string, mixed>|null $instructions
 * @property Carbon|null $expires_at
 * @property Carbon|null $paid_at
 * @property int $refunded_amount
 * @property array<string, mixed>|null $meta
 * @property-read Order $order
 */
class Payment extends Model
{
    protected $table = 'commerce_payments';

    protected $guarded = [];

    protected $casts = [
        'instructions' => 'array',
        'meta' => 'array',
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'amount' => 'integer',
        'refunded_amount' => 'integer',
    ];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function isOpen(): bool
    {
        return in_array($this->status, ['pending', 'awaiting_confirmation', 'failed'], true);
    }
}
