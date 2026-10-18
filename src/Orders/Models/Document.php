<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * An issued document (invoice, packing slip, quotation): its number and
 * the cached PDF of the order version it was rendered from.
 *
 * @property int $id
 * @property int $order_id
 * @property string $type invoice | packing_slip | quotation
 * @property string|null $number
 * @property Carbon|null $issued_at
 * @property string|null $disk
 * @property string|null $path
 * @property int $order_version
 * @property-read Order $order
 */
class Document extends Model
{
    protected $table = 'commerce_documents';

    protected $guarded = [];

    protected $casts = ['issued_at' => 'datetime'];

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
