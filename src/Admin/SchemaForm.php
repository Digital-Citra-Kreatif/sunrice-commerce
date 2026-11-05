<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use JsonSerializable;
use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\Schema;

/**
 * A form built from Sunrice field definitions, rendered by the admin page
 * Commerce/Shared/SchemaForm (or embedded in another page as `form`) with
 * Sunrice's FieldRenderer, and validated here with the fields' own rules.
 *
 *     $form = SchemaForm::make($fields, $values)->action(url, 'put');
 *     $values = $form->validate($request->input('values', []), $extraRules);
 *
 * Posted values live under `values`; errors come back as `values.<handle>`.
 */
class SchemaForm implements JsonSerializable
{
    protected string $action = '';

    protected string $method = 'post';

    protected string $submitLabel = 'Save';

    /**
     * @param  array<int, array<string, mixed>>  $fields
     * @param  array<string, mixed>  $values
     */
    public function __construct(protected array $fields, protected array $values = []) {}

    /**
     * @param  array<int, array<string, mixed>>  $fields
     * @param  array<string, mixed>  $values
     */
    public static function make(array $fields, array $values = []): self
    {
        return new self($fields, $values);
    }

    public function action(string $url, string $method = 'post'): self
    {
        $this->action = $url;
        $this->method = strtolower($method);

        return $this;
    }

    public function submitLabel(string $label): self
    {
        $this->submitLabel = $label;

        return $this;
    }

    public function schema(): Schema
    {
        return Schema::make(Field::listFromArray(self::definitions($this->fields)));
    }

    /**
     * Definitions in the CMS's shape: a group's or repeater's fields at
     * `fields` (written under `config.fields` here too), media fields as
     * `media` (`asset`, with `image_only`, here too).
     *
     * @param  array<int, array<string, mixed>>  $fields
     * @return array<int, array<string, mixed>>
     */
    public static function definitions(array $fields): array
    {
        return array_map(function (array $field): array {
            $config = (array) ($field['config'] ?? []);
            if (is_array($config['fields'] ?? null)) {
                $field['fields'] = self::definitions($config['fields']);
                unset($config['fields']);
            } elseif (is_array($field['fields'] ?? null)) {
                $field['fields'] = self::definitions($field['fields']);
            }
            if (($field['type'] ?? null) === 'asset') {
                $field['type'] = 'media';
                if ($config['image_only'] ?? false) {
                    $config['types'] = ['image'];
                }
                unset($config['image_only']);
            }
            $field['config'] = $config;

            return $field;
        }, $fields);
    }

    /**
     * The fields' rules, keyed by handle (without the `values.` prefix).
     *
     * @param  array<string, mixed>  $input  what was sent (rules can follow it)
     * @return array<string, mixed>
     */
    public function rules(array $input = []): array
    {
        $rules = [];
        foreach ($this->schema()->rules($input, 'values') as $key => $rule) {
            $rules[substr($key, strlen('values.'))] = $rule;
        }

        return $rules;
    }

    /**
     * Validate and normalize posted values: the fields' rules, then
     * $extraRules (keyed by handle); every field's key is returned, and only those.
     *
     * @param  array<string, mixed>  $input
     * @param  array<string, mixed>  $extraRules
     * @return array<string, mixed>
     *
     * @throws ValidationException errors keyed values.<handle>
     */
    public function validate(array $input, array $extraRules = []): array
    {
        $rules = array_merge_recursive($this->rules($input), $extraRules);
        $validator = Validator::make($input, $rules);
        if ($validator->fails()) {
            throw static::prefixed(ValidationException::withMessages($validator->errors()->toArray()));
        }

        $handles = array_column($this->fields, 'handle');

        // Every field is returned (normalized), posted or not.
        return $this->schema()->normalize(array_replace(array_fill_keys($handles, null), array_intersect_key($validator->validated(), array_flip($handles))));
    }

    /** Re-key a validation exception's messages under `values.` (keys starting with `section` stay). */
    public static function prefixed(ValidationException $e): ValidationException
    {
        $messages = [];
        foreach ($e->errors() as $key => $list) {
            $messages[$key === 'section' || str_starts_with($key, 'values.') ? $key : "values.{$key}"] = $list;
        }

        return ValidationException::withMessages($messages);
    }

    /**
     * @return array{fields: array<int, array<string, mixed>>, values: array<string, mixed>, action: string, method: string, submitLabel: string}
     */
    public function toArray(): array
    {
        $defaults = $this->schema()->defaults();

        return [
            'fields' => $this->schema()->toAdmin(),
            'values' => array_replace($defaults, array_intersect_key($this->values, array_flip(array_column($this->fields, 'handle')))),
            'action' => $this->action,
            'method' => $this->method,
            'submitLabel' => $this->submitLabel,
        ];
    }

    /** @return array<string, mixed> */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
