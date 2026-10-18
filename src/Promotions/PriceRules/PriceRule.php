<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\PriceRules;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Bulk, tier and customer-role prices (Shop → Pricing rules): for an
 * audience, on some products, from a quantity, a lower unit price.
 *
 * @property int $id
 * @property string $name
 * @property bool $active
 * @property int $priority
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property string $audience everyone | guests | signed_in | roles
 * @property array<int, string>|null $roles
 * @property string $scope all | products | variants | categories | brands
 * @property string $quantity_basis variant | product | rule
 * @property array<int, array{min_qty: int, type: string, value: int}> $tiers
 * @property Carbon|null $updated_at
 */
class PriceRule extends Model
{
    public const AUDIENCES = ['everyone', 'guests', 'signed_in', 'roles'];

    public const SCOPES = ['all', 'products', 'variants', 'categories', 'brands'];

    public const BASES = ['variant', 'product', 'rule'];

    protected $table = 'commerce_price_rules';

    protected $guarded = [];

    protected $casts = [
        'active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'roles' => 'array',
        'tiers' => 'array',
    ];

    /** @return HasMany<PriceRuleTarget, $this> */
    public function targets(): HasMany
    {
        return $this->hasMany(PriceRuleTarget::class, 'rule_id');
    }
}
