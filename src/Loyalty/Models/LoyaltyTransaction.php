<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Loyalty\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * A line of a customer's points wallet. Credits (earn, release, refund,
 * adjust up) are lots with what is left of them (`remaining`) and an
 * optional expiry; spending uses the lots that expire first.
 *
 * @property int $id
 * @property int $customer_id
 * @property int|null $order_id
 * @property string $kind earn | redeem | release | refund | revoke | adjust | expire
 * @property int $points positive for credits, negative for debits
 * @property int $remaining
 * @property Carbon|null $expires_at
 * @property string|null $note
 * @property int|null $user_id
 * @property Carbon|null $created_at
 * @property-read Customer $customer
 * @property-read Order|null $order
 */
class LoyaltyTransaction extends Model
{
    public const UPDATED_AT = null;

    public const KINDS = ['earn', 'redeem', 'release', 'refund', 'revoke', 'adjust', 'expire'];

    protected $table = 'commerce_loyalty_transactions';

    protected $guarded = ['id'];

    protected $casts = ['points' => 'integer', 'remaining' => 'integer', 'expires_at' => 'datetime'];

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
