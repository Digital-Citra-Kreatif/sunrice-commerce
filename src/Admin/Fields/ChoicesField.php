<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Fields;

use Spatie\Permission\Models\Role;
use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\FieldType;
use Sunrice\Cms\Fields\Schema;
use Sunrice\Commerce\Regions\Countries;
use Sunrice\Commerce\Regions\Region;
use Sunrice\Commerce\Shipping\ShippingTypes;

/**
 * Several values chosen from a searchable list, where a value the list
 * doesn't have can be added as typed: a list of strings.
 * config: options ([{value, label}] or strings), source (countries |
 * provinces | shipping_types | roles: options filled when the form is
 * drawn), creatable (default true), uppercase (values stored in capitals).
 * A comma-separated string is read as its parts.
 */
class ChoicesField extends FieldType
{
    public const SOURCES = ['countries', 'provinces', 'shipping_types', 'roles'];

    public function type(): string
    {
        return 'commerce_choices';
    }

    /** @return list<mixed> */
    public function rules(Field $field): array
    {
        return [function (string $attribute, mixed $value, \Closure $fail): void {
            if ($value !== null && ! is_string($value) && ! is_array($value)) {
                $fail(__('validation.array', ['attribute' => $attribute]));
            }
        }];
    }

    public function nestedRules(Field $field, string $key, mixed $value): array
    {
        return is_array($value) ? ["{$key}.*" => ['nullable', 'string', 'max:100']] : [];
    }

    public function defaultValue(Field $field): mixed
    {
        return [];
    }

    /** @return list<string> */
    public function normalize(mixed $value, Field $field): mixed
    {
        $values = is_array($value) ? $value : explode(',', (string) $value);
        $values = array_filter(array_map(fn ($v) => trim((string) $v), $values), fn (string $v) => $v !== '');
        if ($field->config('uppercase', false)) {
            $values = array_map('strtoupper', $values);
        }

        return array_values(array_unique($values));
    }

    public function toAdmin(Field $field, Schema $schema): array
    {
        $config = ['creatable' => true, ...(array) $field->config];
        $source = $config['source'] ?? null;
        if (is_string($source) && in_array($source, self::SOURCES, true)) {
            $config['options'] = [...self::options($source), ...(array) ($config['options'] ?? [])];
        }

        return ['config' => $config] + parent::toAdmin($field, $schema);
    }

    /** @return list<array{value: string, label: string}> */
    public static function options(string $source): array
    {
        return match ($source) {
            'countries' => array_map(fn (array $o) => ['value' => $o['value'], 'label' => "{$o['label']} ({$o['value']})"], Countries::options()),
            'provinces' => Region::query()->active()->where('level', Region::LEVELS['province'])->orderBy('name')->get(['code', 'name'])
                ->map(fn (Region $r) => ['value' => $r->code, 'label' => "{$r->name} ({$r->code})"])->values()->all(),
            'shipping_types' => collect(app(ShippingTypes::class)->options())
                ->map(fn (string $label, string $key) => ['value' => $key, 'label' => "{$label} ({$key})"])->values()->all(),
            'roles' => Role::query()->orderBy('name')->pluck('name')->map(fn ($name) => ['value' => (string) $name, 'label' => (string) $name])->all(),
            default => [],
        };
    }
}
