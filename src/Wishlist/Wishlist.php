<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Wishlist;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int|null $customer_id
 * @property string|null $token guests
 * @property string $share_token
 * @property bool $is_shared
 * @property-read Collection<int, WishlistItem> $items
 */
class Wishlist extends Model
{
    public const LIMIT = 200;

    protected $table = 'commerce_wishlists';

    protected $guarded = [];

    protected $casts = ['is_shared' => 'boolean'];

    /** @return HasMany<WishlistItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(WishlistItem::class)->latest('id');
    }
}
