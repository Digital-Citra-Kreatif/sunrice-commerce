<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Returns\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * A customer's request to send items of an order back: requested, then
 * approved or rejected, received, and closed (refunds are recorded on
 * the order).
 *
 * @property int $id
 * @property int $order_id
 * @property int|null $customer_id
 * @property string $status requested | approved | rejected | received | closed
 * @property string $reason one of REASONS
 * @property string|null $details
 * @property string|null $note
 * @property Carbon|null $resolved_at
 * @property Carbon|null $created_at
 * @property-read Order $order
 * @property-read Collection<int, ReturnItem> $items
 */
class ReturnRequest extends Model
{
    public const STATUSES = ['requested', 'approved', 'rejected', 'received', 'closed'];

    /** Statuses that still count against what's left to return. */
    public const OPEN = ['requested', 'approved', 'received', 'closed'];

    /**
     * Where a return may go from each status. Rejected and closed are final:
     * reopening one could return what another return has since taken.
     */
    public const NEXT = ['requested' => ['approved', 'rejected'], 'approved' => ['received', 'rejected', 'closed'], 'received' => ['closed'], 'rejected' => [], 'closed' => []];

    public const REASONS = ['damaged', 'wrong_item', 'not_as_described', 'does_not_fit', 'changed_mind', 'other'];

    protected $table = 'commerce_returns';

    protected $guarded = [];

    protected $casts = ['resolved_at' => 'datetime'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class)->withTrashed();
    }

    /** @return HasMany<ReturnItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(ReturnItem::class, 'return_id');
    }

    /** @return list<string> this status and the ones it may move to */
    public function allowedStatuses(): array
    {
        return [$this->status, ...(self::NEXT[$this->status] ?? [])];
    }

    public function number(): string
    {
        return 'R'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT);
    }
}
