<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A country, or (Indonesia) a province, city or district code.
 *
 * @property int $id
 * @property int $zone_id
 * @property string $country
 * @property string|null $region_code
 */
class ShippingZoneRegion extends Model
{
    public $timestamps = false;

    protected $table = 'commerce_shipping_zone_regions';

    protected $guarded = [];
}
