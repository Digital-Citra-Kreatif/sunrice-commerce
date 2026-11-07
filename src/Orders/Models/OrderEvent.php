<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Orders\TimelineText;

/**
 * A line of the order timeline: who did what, and when.
 *
 * @property int $id
 * @property int $order_id
 * @property string $type status | payment | note | email | shipment | refund | edit | system
 * @property string $visibility internal | customer
 * @property string|null $message
 * @property array<string, mixed>|null $data
 * @property int|null $user_id
 * @property string $source admin | storefront | system | ai | gateway
 * @property Carbon|null $created_at
 */
class OrderEvent extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'commerce_order_events';

    protected $guarded = [];

    protected $casts = ['data' => 'array'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** The entry's words in a language (the current one when null): recorded as a TimelineText, or as it was written. */
    public function text(?string $locale = null): string
    {
        $text = is_array($this->data['text'] ?? null) ? TimelineText::fromArray($this->data['text']) : null;

        return $text?->in($locale) ?? (string) $this->message;
    }
}
