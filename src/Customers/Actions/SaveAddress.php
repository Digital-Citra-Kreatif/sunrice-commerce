<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Sunrice\Commerce\Checkout\CheckoutData;
use Sunrice\Commerce\Customers\Models\Address;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\AddressRules;

/** Creates or updates an address-book entry (region chain validated); handles the defaults. */
class SaveAddress
{
    public function fromCheckout(Customer $customer, CheckoutData $data): Address
    {
        $input = $data->get('shipping_address', []);
        $label = trim((string) ($input['label'] ?? ''));
        $input['label'] = $label !== '' ? $label : mb_substr(Str::squish((string) ($input['line1'] ?? '')), 0, 60);
        $settings = app(StoreSettings::class);

        return $this->handle($customer, $input, requirements: [
            'phone' => (bool) $settings->get('checkout.require_phone', true),
            'postal_code' => (bool) $settings->get('checkout.require_postal_code', false),
            'village' => (bool) $settings->get('checkout.village_level', false),
        ], reuse: true);
    }

    /**
     * @param  array<string, mixed>  $input
     * @param  array{phone?: bool, postal_code?: bool, village?: bool}  $requirements
     */
    public function handle(Customer $customer, array $input, ?Address $address = null, array $requirements = [], bool $reuse = false): Address
    {
        abort_if($address !== null && $address->customer_id !== $customer->id, 404);
        $validator = Validator::make(['address' => $input], [
            ...AddressRules::rules('address', $requirements),
            'address.label' => ['nullable', 'string', 'max:60'],
            'address.default_shipping' => ['nullable', 'boolean'],
            'address.default_billing' => ['nullable', 'boolean'],
        ]);
        $validator->after(fn ($v) => AddressRules::after($v, 'address'));
        $validator->validate();

        $normalized = AddressRules::normalize($input)->toArray();
        $values = [
            ...array_intersect_key($normalized, array_flip(['name', 'phone', 'company', 'country', 'province_code', 'city_code', 'district_code', 'village_code',
                'province', 'city', 'district', 'village', 'state', 'postal_code', 'line1', 'line2', 'notes'])),
            'label' => $input['label'] ?? null,
        ];

        return DB::transaction(function () use ($customer, $address, $input, $values, $reuse): Address {
            if ($reuse) {
                Customer::query()->whereKey($customer->id)->lockForUpdate()->firstOrFail();
                $existing = $customer->addresses()->where($values)->orderBy('id')->first();
                if ($existing !== null) {
                    return $existing;
                }
            }

            $first = $customer->addresses()->doesntExist();
            foreach (['default_shipping', 'default_billing'] as $flag) {
                $values[$flag] = $first || (bool) ($input[$flag] ?? false);
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
