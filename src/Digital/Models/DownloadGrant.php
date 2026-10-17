<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Digital\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Catalog\Models\DownloadFile;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;

/**
 * The right to download one file of an order line: a long token (the
 * link works without an account), an optional count limit and expiry.
 *
 * @property int $id
 * @property int $order_id
 * @property int $order_item_id
 * @property int $download_file_id
 * @property int|null $customer_id
 * @property string|null $email
 * @property string $token
 * @property int|null $downloads_remaining
 * @property int $download_count
 * @property Carbon|null $expires_at
 * @property Carbon|null $revoked_at
 * @property Carbon|null $last_downloaded_at
 * @property-read Order $order
 * @property-read OrderItem $item
 * @property-read DownloadFile $file
 */
class DownloadGrant extends Model
{
    protected $table = 'commerce_download_grants';

    protected $guarded = [];

    protected $casts = ['expires_at' => 'datetime', 'revoked_at' => 'datetime', 'last_downloaded_at' => 'datetime'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<OrderItem, $this> */
    public function item(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }

    /** @return BelongsTo<DownloadFile, $this> */
    public function file(): BelongsTo
    {
        return $this->belongsTo(DownloadFile::class, 'download_file_id')->withTrashed();
    }

    /** Why it can't be used now (null when it can): revoked | expired | used_up. */
    public function refusal(): ?string
    {
        return match (true) {
            $this->revoked_at !== null => 'revoked',
            $this->expires_at !== null && $this->expires_at->isPast() => 'expired',
            $this->downloads_remaining !== null && $this->downloads_remaining <= 0 => 'used_up',
            default => null,
        };
    }

    public function url(): string
    {
        return commerce_url('commerce.download', ['token' => $this->token]);
    }
}
