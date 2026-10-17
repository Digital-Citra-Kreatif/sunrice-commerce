<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Fields;

use Sunrice\Commerce\Regions\Countries;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Fields\FieldType;

/**
 * Country, then (in Indonesia) province → city → district → village:
 * {country, province_code, city_code, district_code, village_code}.
 * config: depth (province | city | district | village; default district),
 * countries (bool, default true: other countries can be chosen).
 */
class RegionField extends FieldType
{
    public const KEYS = ['province_code', 'city_code', 'district_code', 'village_code'];

    public static function type(): string
    {
        return 'commerce_region';
    }

    public function rules(array $field): array
    {
        return ['array', function (string $attribute, mixed $value, \Closure $fail): void {
            $value = (array) $value;
            if (strtoupper((string) ($value['country'] ?? 'ID')) !== 'ID') {
                return;
            }
            $parent = null;
            foreach (self::KEYS as $key) {
                $code = $value[$key] ?? null;
                if ($code === null || $code === '') {
                    return;
                }
                $region = Region::query()->whereKey($code)->where('active', true)->first();
                if ($region === null || $region->parent_code !== $parent) {
                    $fail(__('commerce::validation.region'));

                    return;
                }
                $parent = $code;
            }
        }];
    }

    public function normalize(mixed $value, array $field): mixed
    {
        $value = is_array($value) ? $value : [];
        $country = strtoupper((string) ($value['country'] ?? 'ID')) ?: 'ID';
        $normalized = ['country' => $country];
        foreach (self::KEYS as $key) {
            $code = $value[$key] ?? null;
            $normalized[$key] = $country === 'ID' && is_string($code) && $code !== '' ? $code : null;
        }

        return $normalized;
    }

    public function toAdminSchema(array $field): array
    {
        $field['config'] = [
            'depth' => 'district',
            'countries' => true,
            'api' => route('commerce.api.regions', [], false),
            ...($field['config'] ?? []),
        ];
        if ($field['config']['countries']) {
            $field['config']['country_options'] = Countries::options();
        }

        return $field;
    }
}
