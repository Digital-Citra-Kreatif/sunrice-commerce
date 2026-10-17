<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use JsonSerializable;
use Sunrice\Fields\BlueprintSchema;

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

    public function schema(): BlueprintSchema
    {
        return BlueprintSchema::make($this->fields);
    }

    /**
     * The fields' rules, keyed by handle (without the `values.` prefix).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [];
        foreach ($this->schema()->rules('values') as $key => $rule) {
            $rules[substr($key, strlen('values.'))] = $rule;
        }

        return $rules;
    }

    /**
     * Validate and normalize posted values: the fields' rules, then
     * $extraRules (keyed by handle); only the fields' keys are returned.
     *
     * @param  array<string, mixed>  $input
     * @param  array<string, mixed>  $extraRules
     * @return array<string, mixed>
     *
     * @throws ValidationException errors keyed values.<handle>
     */
    public function validate(array $input, array $extraRules = []): array
    {
        $rules = array_merge_recursive($this->rules(), $extraRules);
        $validator = Validator::make($input, $rules);
        if ($validator->fails()) {
            throw static::prefixed(ValidationException::withMessages($validator->errors()->toArray()));
        }

        $handles = array_column($this->fields, 'handle');

        return $this->schema()->normalize(array_intersect_key($validator->validated(), array_flip($handles)));
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
            'fields' => $this->schema()->toAdminSchema(),
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
