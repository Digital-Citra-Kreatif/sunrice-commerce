<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A voucher used by an order; released (released_at) when the order is
 * cancelled or expires.
 *
 * @property int $id
 * @property int $voucher_id
 * @property int $order_id
 * @property int|null $customer_id
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $code
 * @property int $amount
 * @property Carbon|null $released_at
 */
class VoucherRedemption extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'commerce_voucher_redemptions';

    protected $guarded = [];

    protected $casts = ['released_at' => 'datetime', 'amount' => 'integer'];

    /** @return BelongsTo<Voucher, $this> */
    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class)->withTrashed();
    }
}
