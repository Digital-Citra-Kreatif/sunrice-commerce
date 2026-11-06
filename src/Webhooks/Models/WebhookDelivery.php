<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One event sent (or being sent) to one endpoint: the JSON body as it was
 * when the event happened, and how its attempts went.
 *
 * @property int $id
 * @property string $uuid the X-Sunrice-Delivery header, the same on every attempt
 * @property int $webhook_id
 * @property string $event
 * @property array<string, mixed> $payload
 * @property string $status pending | delivered | failed
 * @property int $attempts
 * @property int|null $response_status
 * @property string|null $error
 * @property Carbon|null $delivered_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Webhook $webhook
 */
class WebhookDelivery extends Model
{
    public const STATUSES = ['pending', 'delivered', 'failed'];

    protected $table = 'commerce_webhook_deliveries';

    protected $guarded = ['id'];

    protected $casts = ['payload' => 'array', 'attempts' => 'integer', 'response_status' => 'integer', 'delivered_at' => 'datetime'];

    /** @return BelongsTo<Webhook, $this> */
    public function webhook(): BelongsTo
    {
        return $this->belongsTo(Webhook::class);
    }
}
