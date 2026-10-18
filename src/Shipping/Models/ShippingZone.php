<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property int $position
 * @property bool $everywhere_else
 * @property-read Collection<int, ShippingZoneRegion> $regions
 * @property-read Collection<int, ShippingMethod> $methods
 */
class ShippingZone extends Model
{
    protected $table = 'commerce_shipping_zones';

    protected $guarded = [];

    protected $casts = ['everywhere_else' => 'boolean', 'position' => 'integer'];

    /** @return HasMany<ShippingZoneRegion, $this> */
    public function regions(): HasMany
    {
        return $this->hasMany(ShippingZoneRegion::class, 'zone_id')->orderBy('id');
    }

    /** @return HasMany<ShippingMethod, $this> */
    public function methods(): HasMany
    {
        return $this->hasMany(ShippingMethod::class, 'zone_id')->orderBy('position')->orderBy('id');
    }
}
