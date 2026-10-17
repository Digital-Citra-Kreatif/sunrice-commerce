<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Taxes;

use Illuminate\Database\Eloquent\Model;

/**
 * A tax rate for a class, in a country or region (null = everywhere).
 * rate in basis points (11% = 1100).
 *
 * @property int $id
 * @property string $tax_class
 * @property string|null $country
 * @property string|null $region_code
 * @property string $name
 * @property int $rate
 * @property bool $compound
 * @property bool $shipping
 * @property int $priority
 */
class TaxRate extends Model
{
    protected $table = 'commerce_tax_rates';

    protected $guarded = [];

    protected $casts = ['rate' => 'integer', 'compound' => 'boolean', 'shipping' => 'boolean', 'priority' => 'integer'];
}
