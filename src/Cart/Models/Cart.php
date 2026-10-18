<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Customers\Models\Customer;

/**
 * @property int $id
 * @property string $token
 * @property int|null $customer_id
 * @property string $currency
 * @property string|null $locale
 * @property array<int, string>|null $vouchers
 * @property array<string, mixed>|null $checkout
 * @property string $status active | merged | converted | abandoned
 * @property int|null $order_id
 * @property Carbon|null $last_activity_at
 * @property-read Collection<int, CartItem> $items
 */
class Cart extends Model
{
    protected $table = 'commerce_carts';

    protected $guarded = [];

    protected $casts = ['vouchers' => 'array', 'checkout' => 'array', 'last_activity_at' => 'datetime'];

    /** @return HasMany<CartItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class)->orderBy('id');
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function touchActivity(): void
    {
        $this->forceFill(['last_activity_at' => now()])->save();
    }

    public function quantity(): int
    {
        return (int) $this->items->sum('quantity');
    }
}
