<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A digital product's file (on the private downloads disk) or link.
 * Uploaded unattached; attached when a published product references it.
 *
 * @property int $id
 * @property int|null $product_id
 * @property int|null $variant_id
 * @property string|null $uid
 * @property string $type file | url
 * @property string $name
 * @property string|null $disk
 * @property string|null $path
 * @property string|null $filename
 * @property string|null $mime_type
 * @property int|null $size
 * @property string|null $url
 * @property int|null $uploaded_by
 * @property bool $attached
 */
class DownloadFile extends Model
{
    use SoftDeletes;

    protected $table = 'commerce_download_files';

    protected $guarded = [];

    protected $casts = ['attached' => 'boolean', 'size' => 'integer'];

    protected $hidden = ['path', 'disk'];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class)->withTrashed();
    }
}
