<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Customers\Models\Customer;

/**
 * One marketing email to one person. Status: queued | sending | sent |
 * failed | skipped (consent withdrawn before it went out).
 *
 * @property int $id
 * @property int $campaign_id
 * @property int|null $customer_id
 * @property string $email
 * @property string|null $locale
 * @property string $dedupe_key
 * @property string $token
 * @property string $status
 * @property array<string, mixed>|null $context
 * @property string|null $error
 * @property Carbon|null $sent_at
 * @property Carbon|null $opened_at
 * @property int $open_count
 * @property Carbon|null $clicked_at
 * @property int $click_count
 * @property Carbon|null $unsubscribed_at
 * @property-read Campaign $campaign
 * @property-read Customer|null $customer
 */
class CampaignSend extends Model
{
    protected $table = 'commerce_campaign_sends';

    protected $guarded = [];

    protected $casts = [
        'context' => 'array',
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    /** @return BelongsTo<Campaign, $this> */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
