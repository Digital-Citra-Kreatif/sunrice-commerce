<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * A gift card code, redeemed once for loyalty points.
 *
 * @property int $id
 * @property string $code
 * @property int $value minor units: the points it adds
 * @property string $status active | redeemed | disabled
 * @property Carbon|null $expires_at redeem by
 * @property int|null $order_id the order that bought it
 * @property int|null $order_item_id
 * @property int|null $redeemed_by customer
 * @property Carbon|null $redeemed_at
 * @property string|null $note
 * @property int|null $user_id staff who made it
 * @property Carbon|null $created_at
 * @property-read Order|null $order
 * @property-read Customer|null $redeemer
 */
class GiftCard extends Model
{
    public const ACTIVE = 'active';

    public const REDEEMED = 'redeemed';

    public const DISABLED = 'disabled';

    protected $table = 'commerce_gift_cards';

    protected $guarded = [];

    protected $casts = ['value' => 'integer', 'expires_at' => 'datetime', 'redeemed_at' => 'datetime'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<Customer, $this> */
    public function redeemer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'redeemed_by');
    }

    /** Can be redeemed now: active and not past its date. */
    public function redeemable(): bool
    {
        return $this->status === self::ACTIVE && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    /** "ABCD-EFGH-JKLM": the code as people read it (stored without dashes). */
    public function formatted(): string
    {
        return implode('-', str_split($this->code, 4));
    }
}
