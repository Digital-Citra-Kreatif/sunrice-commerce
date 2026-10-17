<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Fields;

use Sunrice\Fields\FieldType;

/**
 * Products, variants and/or terms a promotion targets:
 * [{type: product|variant|term, id, label}]. config: types (default all),
 * taxonomies (term handles to search; default categories and brands).
 */
class TargetsField extends FieldType
{
    public const TYPES = ['product', 'variant', 'term'];

    public static function type(): string
    {
        return 'commerce_targets';
    }

    public function rules(array $field): array
    {
        return ['array', 'max:500'];
    }

    public function normalize(mixed $value, array $field): mixed
    {
        $out = [];
        foreach (is_array($value) ? $value : [] as $item) {
            if (is_array($item) && in_array($item['type'] ?? null, self::TYPES, true) && is_numeric($item['id'] ?? null)) {
                $key = $item['type'].':'.(int) $item['id'];
                $out[$key] = ['type' => $item['type'], 'id' => (int) $item['id'], 'label' => mb_substr((string) ($item['label'] ?? ''), 0, 200)];
            }
        }

        return array_values($out);
    }

    public function toAdminSchema(array $field): array
    {
        $field['config'] = [
            'types' => self::TYPES,
            'taxonomies' => array_values(array_filter([config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy')])),
            'api' => route('sunrice.admin.commerce.api.targets', [], false),
            ...($field['config'] ?? []),
        ];

        return $field;
    }
}
