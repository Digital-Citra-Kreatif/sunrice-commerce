<?php

declare(strict_types=1);

namespace Sunrice\Commerce\GiftCards\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * A change of a gift card's balance: issue, redeem (negative, an order),
 * release (the order cancelled) or adjust (staff).
 *
 * @property int $id
 * @property int $gift_card_id
 * @property int|null $order_id
 * @property string $kind
 * @property int $amount
 * @property int|null $user_id
 * @property Carbon|null $created_at
 * @property-read GiftCard $giftCard
 * @property-read Order|null $order
 */
class GiftCardTransaction extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'commerce_gift_card_transactions';

    protected $guarded = ['id'];

    protected $casts = ['amount' => 'integer'];

    /** @return BelongsTo<GiftCard, $this> */
    public function giftCard(): BelongsTo
    {
        return $this->belongsTo(GiftCard::class);
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
