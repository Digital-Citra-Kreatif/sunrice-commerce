<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sunrice\Commerce\Catalog\Models\Variant;

/**
 * @property int $id
 * @property int $cart_id
 * @property int $variant_id
 * @property string $line_key
 * @property int $quantity
 * @property int|null $unit_price_seen
 * @property array<string, mixed>|null $meta
 * @property-read Variant $variant
 */
class CartItem extends Model
{
    protected $table = 'commerce_cart_items';

    protected $guarded = [];

    protected $casts = ['meta' => 'array', 'quantity' => 'integer', 'unit_price_seen' => 'integer'];

    protected static function booted(): void
    {
        static::saving(function (CartItem $item): void {
            $item->line_key = self::lineKey($item->meta);
        });
    }

    /**
     * What tells two lines of one variant apart: a hash of the meta, keys in
     * any order, or '' without meta.
     *
     * @param  array<string, mixed>|null  $meta
     */
    public static function lineKey(?array $meta): string
    {
        if ($meta === null || $meta === []) {
            return '';
        }

        return sha1((string) json_encode(self::sorted($meta)));
    }

    /**
     * @param  array<mixed>  $value
     * @return array<mixed>
     */
    protected static function sorted(array $value): array
    {
        if (! array_is_list($value)) {
            ksort($value);
        }

        return array_map(fn ($v) => is_array($v) ? self::sorted($v) : $v, $value);
    }

    /** @return BelongsTo<Cart, $this> */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /** @return BelongsTo<Variant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class)->withTrashed();
    }
}
