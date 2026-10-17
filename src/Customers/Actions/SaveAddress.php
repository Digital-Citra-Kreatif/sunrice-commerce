<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Support\AddressRules;

/** Creates or updates an address-book entry (region chain validated); handles the defaults. */
class SaveAddress
{
    /** @param  array<string, mixed>  $input */
    public function handle(Customer $customer, array $input, ?Address $address = null): Address
    {
        abort_if($address !== null && $address->customer_id !== $customer->id, 404);
        $validator = Validator::make(['address' => $input], [
            ...AddressRules::rules('address'),
            'address.label' => ['nullable', 'string', 'max:60'],
            'address.default_shipping' => ['nullable', 'boolean'],
            'address.default_billing' => ['nullable', 'boolean'],
        ]);
        $validator->after(fn ($v) => AddressRules::after($v, 'address'));
        $validator->validate();

        $normalized = AddressRules::normalize($input)->toArray();
        $first = $customer->addresses()->doesntExist();
        $values = [
            ...array_intersect_key($normalized, array_flip(['name', 'phone', 'company', 'country', 'province_code', 'city_code', 'district_code', 'village_code',
                'province', 'city', 'district', 'village', 'state', 'postal_code', 'line1', 'line2', 'notes'])),
            'label' => $input['label'] ?? null,
            'default_shipping' => $first || (bool) ($input['default_shipping'] ?? false),
            'default_billing' => $first || (bool) ($input['default_billing'] ?? false),
        ];

        return DB::transaction(function () use ($customer, $address, $values): Address {
            foreach (['default_shipping', 'default_billing'] as $flag) {
                if ($values[$flag]) {
                    $customer->addresses()->when($address !== null, fn ($q) => $q->whereKeyNot($address->id))->update([$flag => false]);
                }
            }
            $address ??= new Address(['customer_id' => $customer->id]);
            $address->fill($values)->save();

            return $address;
        });
    }
}
