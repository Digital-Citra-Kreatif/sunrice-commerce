<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Fields;

use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\FieldType;
use Sunrice\Cms\Fields\Schema;

/**
 * Products, variants and/or terms a promotion targets:
 * [{type: product|variant|term, id, label}]. config: types (default all),
 * taxonomies (term handles to search; default categories and brands).
 */
class TargetsField extends FieldType
{
    public const TYPES = ['product', 'variant', 'term'];

    public function type(): string
    {
        return 'commerce_targets';
    }

    /** @return list<mixed> */
    public function rules(Field $field): array
    {
        return ['array', 'max:500'];
    }

    public function normalize(mixed $value, Field $field): mixed
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

    public function toAdmin(Field $field, Schema $schema): array
    {
        return ['config' => [
            'types' => self::TYPES,
            'taxonomies' => array_values(array_filter([config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy')])),
            'api' => route('sunrice.admin.commerce.api.targets', [], false),
            ...(array) $field->config,
        ]] + parent::toAdmin($field, $schema);
    }
}
