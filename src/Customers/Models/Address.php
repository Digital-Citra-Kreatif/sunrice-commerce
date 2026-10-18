<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A saved address of a customer (address book).
 *
 * @property int $id
 * @property int $customer_id
 * @property string|null $label
 * @property string $name
 * @property string|null $phone
 * @property string|null $company
 * @property string $country
 * @property string|null $province_code
 * @property string|null $city_code
 * @property string|null $district_code
 * @property string|null $village_code
 * @property string|null $province
 * @property string|null $city
 * @property string|null $district
 * @property string|null $village
 * @property string|null $state
 * @property string|null $postal_code
 * @property string $line1
 * @property string|null $line2
 * @property string|null $notes
 * @property bool $default_shipping
 * @property bool $default_billing
 */
class Address extends Model
{
    protected $table = 'commerce_addresses';

    protected $guarded = [];

    protected $casts = ['default_shipping' => 'boolean', 'default_billing' => 'boolean'];

    /** @return BelongsTo<Customer, $this> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return array<string, mixed> the address as checkout data */
    public function toAddress(): array
    {
        return $this->only(['name', 'phone', 'company', 'country', 'province_code', 'city_code', 'district_code', 'village_code',
            'province', 'city', 'district', 'village', 'state', 'postal_code', 'line1', 'line2', 'notes']);
    }
}
