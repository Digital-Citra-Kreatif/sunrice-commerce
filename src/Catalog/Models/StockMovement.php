<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * A change of a variant's stock, with its reason.
 *
 * @property int $id
 * @property int $variant_id
 * @property int $delta
 * @property int|null $quantity_after
 * @property string $reason
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property int|null $user_id
 * @property string|null $note
 * @property Carbon|null $created_at
 */
class StockMovement extends Model
{
    public const REASONS = ['initial', 'order', 'cancel', 'expire', 'refund', 'manual', 'import', 'correction'];

    public const UPDATED_AT = null;

    protected $table = 'commerce_stock_movements';

    protected $guarded = [];

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class)->withTrashed();
    }

    /** @return MorphTo<Model, $this> */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }
}
