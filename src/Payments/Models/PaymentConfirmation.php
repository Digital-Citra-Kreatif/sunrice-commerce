<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * A customer's "I have paid" with the transfer details and proof.
 *
 * @property int $id
 * @property int $order_id
 * @property int|null $payment_id
 * @property int|null $customer_id
 * @property string $sender_name
 * @property string|null $sender_bank
 * @property int $amount
 * @property Carbon|null $transferred_at
 * @property array<string, mixed>|null $destination
 * @property string|null $proof_disk
 * @property string|null $proof_path
 * @property string|null $note
 * @property string $status submitted | approved | rejected
 * @property int|null $reviewed_by
 * @property Carbon|null $reviewed_at
 * @property string|null $review_note
 * @property string|null $ip_address
 * @property Carbon|null $created_at
 * @property-read Order $order
 * @property-read Payment|null $payment
 */
class PaymentConfirmation extends Model
{
    protected $table = 'commerce_payment_confirmations';

    protected $guarded = [];

    protected $casts = ['destination' => 'array', 'transferred_at' => 'date', 'reviewed_at' => 'datetime', 'amount' => 'integer'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<Payment, $this> */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
