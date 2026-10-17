<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A gateway notification as received: for idempotency (one row per
 * method and event id) and for looking back when something went wrong.
 *
 * @property int $id
 * @property string $method
 * @property string|null $event_id
 * @property string $payload_hash
 * @property int|null $payment_id
 * @property string $status received | processed | failed | ignored
 * @property string|null $error
 * @property Carbon|null $received_at
 * @property Carbon|null $processed_at
 */
class WebhookCall extends Model
{
    public $timestamps = false;

    protected $table = 'commerce_webhook_calls';

    protected $guarded = [];

    protected $casts = ['received_at' => 'datetime', 'processed_at' => 'datetime'];
}
