<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * An endpoint that receives the store's events (Settings → Webhooks).
 * `failures` counts failed deliveries in a row; at
 * `commerce.webhooks.disable_after` the endpoint is switched off
 * (`active` false, `disabled_at` set) until staff switch it back on.
 *
 * @property int $id
 * @property string $name
 * @property string $url
 * @property list<string> $events
 * @property string $secret signs each delivery (stored encrypted)
 * @property bool $active
 * @property int $failures
 * @property Carbon|null $disabled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Webhook extends Model
{
    protected $table = 'commerce_webhooks';

    protected $guarded = ['id'];

    protected $hidden = ['secret'];

    protected $casts = ['events' => 'array', 'secret' => 'encrypted', 'active' => 'boolean', 'failures' => 'integer', 'disabled_at' => 'datetime'];

    /** @return HasMany<WebhookDelivery, $this> */
    public function deliveries(): HasMany
    {
        return $this->hasMany(WebhookDelivery::class);
    }

    public function listensTo(string $event): bool
    {
        return in_array($event, $this->events, true);
    }
}
