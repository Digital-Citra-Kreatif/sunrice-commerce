<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Fields;

use Sunrice\Fields\FieldType;

/**
 * An amount in the store currency, stored in minor units (integer).
 * config: min, max (minor units), allow_null (default true).
 */
class MoneyField extends FieldType
{
    public static function type(): string
    {
        return 'commerce_money';
    }

    public function rules(array $field): array
    {
        $rules = ['integer'];
        $rules[] = 'min:'.(int) ($field['config']['min'] ?? 0);
        if (($field['config']['max'] ?? null) !== null) {
            $rules[] = 'max:'.(int) $field['config']['max'];
        }

        return $rules;
    }

    public function normalize(mixed $value, array $field): mixed
    {
        if ($value === null || $value === '') {
            return ($field['config']['allow_null'] ?? true) ? null : 0;
        }

        return is_numeric($value) ? (int) round((float) $value) : null;
    }

    public function sortCast(): ?string
    {
        return 'number';
    }
}
