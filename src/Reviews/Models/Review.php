<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Reviews\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * A customer's review of a product: a rating (1–5) and text, shown once
 * approved, with the store's reply.
 *
 * @property int $id
 * @property int $product_id
 * @property int|null $customer_id
 * @property int|null $order_id
 * @property string $name
 * @property string|null $email
 * @property int $rating
 * @property string|null $title
 * @property string $body
 * @property string|null $locale
 * @property string $status pending | approved | rejected
 * @property string|null $reply
 * @property Carbon|null $replied_at
 * @property string|null $ip_address
 * @property Carbon|null $created_at
 * @property-read Product $product
 * @property-read Customer|null $customer
 */
class Review extends Model
{
    public const STATUSES = ['pending', 'approved', 'rejected'];

    protected $table = 'commerce_reviews';

    protected $guarded = [];

    protected $casts = ['rating' => 'integer', 'replied_at' => 'datetime'];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function verified(): bool
    {
        return $this->order_id !== null;
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }
}
