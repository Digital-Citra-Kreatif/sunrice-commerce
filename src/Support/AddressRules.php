<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support;

use Illuminate\Validation\Validator;
use Sunrice\Commerce\Regions\Countries;
use Sunrice\Commerce\Regions\Region;

/**
 * Validation for an address under a prefix ("shipping_address."). For
 * Indonesia the region codes must exist, be active and form one chain
 * (village in district in city in province); their names are filled in
 * from the region table by normalize().
 */
final class AddressRules
{
    /**
     * @param  array{phone?: bool, postal_code?: bool, village?: bool, company?: bool}  $require
     * @return array<string, array<int, mixed>>
     */
    public static function rules(string $prefix, array $require = []): array
    {
        $p = $prefix === '' ? '' : rtrim($prefix, '.').'.';

        return [
            "{$p}name" => ['required', 'string', 'max:120'],
            "{$p}phone" => [($require['phone'] ?? true) ? 'required' : 'nullable', 'string', 'max:30'],
            "{$p}company" => [($require['company'] ?? false) ? 'required' : 'nullable', 'string', 'max:120'],
            "{$p}country" => ['required', 'string', 'size:2', function (string $attribute, mixed $value, \Closure $fail) {
                if (! is_string($value) || ! Countries::exists($value)) {
                    $fail(__('commerce::validation.country'));
                }
            }],
            "{$p}province_code" => ["required_if:{$p}country,ID", 'nullable', 'string', 'max:13'],
            "{$p}city_code" => ["required_if:{$p}country,ID", 'nullable', 'string', 'max:13'],
            "{$p}district_code" => ["required_if:{$p}country,ID", 'nullable', 'string', 'max:13'],
            "{$p}village_code" => [($require['village'] ?? false) ? "required_if:{$p}country,ID" : 'nullable', 'nullable', 'string', 'max:13'],
            "{$p}state" => ['nullable', 'string', 'max:120'],
            "{$p}city" => ["required_unless:{$p}country,ID", 'nullable', 'string', 'max:120'],
            "{$p}postal_code" => [($require['postal_code'] ?? false) ? 'required' : 'nullable', 'string', 'max:12'],
            "{$p}line1" => ['required', 'string', 'max:255'],
            "{$p}line2" => ['nullable', 'string', 'max:255'],
            "{$p}notes" => ['nullable', 'string', 'max:255'],
        ];
    }

    /** Add the region-chain check to a validator (run after the rules). */
    public static function after(Validator $validator, string $prefix): void
    {
        $p = $prefix === '' ? '' : rtrim($prefix, '.').'.';
        $data = $validator->getData();
        $address = (array) data_get($data, rtrim($p, '.'), $data);
        if (strtoupper((string) ($address['country'] ?? '')) !== 'ID') {
            return;
        }

        $chain = array_filter([
            'province_code' => $address['province_code'] ?? null,
            'city_code' => $address['city_code'] ?? null,
            'district_code' => $address['district_code'] ?? null,
            'village_code' => $address['village_code'] ?? null,
        ]);
        if ($chain === []) {
            return;
        }
        $regions = Region::query()->whereIn('code', array_values($chain))->where('active', true)->get()->keyBy('code');

        $parent = null;
        foreach ($chain as $field => $code) {
            $region = $regions->get($code);
            if ($region === null || $region->parent_code !== $parent || $region->level !== Region::levelOf((string) $code)) {
                $validator->errors()->add("{$p}{$field}", __('commerce::validation.region'));

                return;
            }
            $parent = $code;
        }
    }

    /**
     * The address with region names from the region table and the phone in E.164.
     *
     * @param  array<string, mixed>  $values
     */
    public static function normalize(array $values): Address
    {
        $values['country'] = strtoupper((string) ($values['country'] ?? 'ID'));
        if ($values['country'] === 'ID') {
            $codes = array_filter([$values['province_code'] ?? null, $values['city_code'] ?? null, $values['district_code'] ?? null, $values['village_code'] ?? null]);
            $names = Region::query()->whereIn('code', $codes)->pluck('name', 'code');
            foreach (['province', 'city', 'district', 'village'] as $level) {
                $code = $values["{$level}_code"] ?? null;
                $values[$level] = $code !== null ? ($names[$code] ?? null) : null;
            }
            if (empty($values['postal_code']) && ! empty($values['village_code'])) {
                $values['postal_code'] = Region::query()->whereKey($values['village_code'])->value('postal_code');
            }
        }
        $values['phone'] = Phone::normalize(isset($values['phone']) ? (string) $values['phone'] : null, $values['country']) ?? ($values['phone'] ?? null);

        return Address::fromArray($values);
    }
}
