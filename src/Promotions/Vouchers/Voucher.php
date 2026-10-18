<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * A discount code, or an automatic discount (no code).
 *
 * @property int $id
 * @property string|null $code
 * @property string $name
 * @property string|null $description
 * @property bool $automatic
 * @property string $type percent | fixed_cart | fixed_item | free_shipping | buy_x_get_y
 * @property int $value basis points for percent, else minor units
 * @property int|null $max_discount
 * @property array{buy_qty: int, get_qty: int, get_type: string, get_value: int}|null $bxgy
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property int|null $min_subtotal
 * @property int|null $max_subtotal
 * @property string $subtotal_basis eligible | cart
 * @property int|null $min_quantity
 * @property bool $exclude_sale_items
 * @property string $audience everyone | signed_in | roles | customers | first_order
 * @property array<int, string>|null $roles
 * @property array<int, string>|null $payment_methods
 * @property array<int, string>|null $shipping_methods
 * @property array<int, array{country: string, region_code?: string|null}>|null $destinations
 * @property int|null $usage_limit
 * @property int|null $usage_limit_per_customer
 * @property int $times_used
 * @property bool $combinable
 * @property bool $exclusive
 * @property int $priority
 * @property bool $active
 */
class Voucher extends Model
{
    use SoftDeletes;

    public const TYPES = ['percent', 'fixed_cart', 'fixed_item', 'free_shipping', 'buy_x_get_y'];

    public const AUDIENCES = ['everyone', 'signed_in', 'roles', 'customers', 'first_order'];

    protected $table = 'commerce_vouchers';

    protected $guarded = [];

    protected $casts = [
        'automatic' => 'boolean',
        'value' => 'integer',
        'max_discount' => 'integer',
        'bxgy' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'min_subtotal' => 'integer',
        'max_subtotal' => 'integer',
        'exclude_sale_items' => 'boolean',
        'roles' => 'array',
        'payment_methods' => 'array',
        'shipping_methods' => 'array',
        'destinations' => 'array',
        'combinable' => 'boolean',
        'exclusive' => 'boolean',
        'active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (Voucher $voucher): void {
            $voucher->code = $voucher->code === null || $voucher->code === '' ? null : mb_strtoupper(trim($voucher->code));
        });
    }

    /** @return HasMany<VoucherTarget, $this> */
    public function targets(): HasMany
    {
        return $this->hasMany(VoucherTarget::class);
    }

    /** @return HasMany<VoucherCustomer, $this> */
    public function customers(): HasMany
    {
        return $this->hasMany(VoucherCustomer::class);
    }

    /** @return HasMany<VoucherRedemption, $this> */
    public function redemptions(): HasMany
    {
        return $this->hasMany(VoucherRedemption::class);
    }

    public function label(): string
    {
        return $this->code ?? $this->name;
    }
}
