<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use JsonSerializable;
use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\Schema;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Models\Taxonomy;
use Sunrice\Cms\Models\Term;
use Sunrice\Cms\Support\Locales;

/**
 * A form built from Sunrice field definitions, rendered by the admin page
 * Commerce/Shared/SchemaForm (or embedded in another page as `form`) with
 * Sunrice's FieldRenderer, and validated here with the fields' own rules.
 *
 *     $form = SchemaForm::make($fields, $values)->action(url, 'put');
 *     $values = $form->validate($request->input('values', []), $extraRules);
 *
 * Posted values live under `values`; errors come back as `values.<handle>`.
 * A field's `section` (a title) puts it in that section of the page, a
 * card of its own, in the order the sections first appear, or in the
 * order descriptions() names them, which also gives each a line under its
 * title ('' for none). Fields side by side and shown
 * only with others' values use the CMS's `width` and `condition`.
 */
class SchemaForm implements JsonSerializable
{
    /** At most this many entries or terms offered by an entries or terms field. */
    public const CHOICES = 300;

    protected string $action = '';

    protected string $method = 'post';

    protected string $submitLabel = 'Save';

    /** @var array<string, string> section title => its description */
    protected array $descriptions = [];

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

    /** @param  array<string, string>  $descriptions  section title => the line under it */
    public function descriptions(array $descriptions): self
    {
        $this->descriptions = $descriptions;

        return $this;
    }

    /**
     * The page's sections in order: fields without a `section` first (no title), then each section.
     *
     * @return list<array{title: string|null, description: string|null, fields: list<string>}>
     */
    public function sections(): array
    {
        $sections = [];
        foreach ($this->fields as $field) {
            $title = is_string($field['section'] ?? null) && $field['section'] !== '' ? $field['section'] : null;
            $sections[$title ?? ''] ??= ['title' => $title, 'description' => $title !== null ? ($this->descriptions[$title] ?? null) : null, 'fields' => []];
            $sections[$title ?? '']['fields'][] = (string) $field['handle'];
        }

        $order = array_flip(array_keys($this->descriptions));
        uksort($sections, fn (string $a, string $b): int => [$a === '' ? -1 : ($order[$a] ?? PHP_INT_MAX), array_search($a, array_keys($sections), true)]
            <=> [$b === '' ? -1 : ($order[$b] ?? PHP_INT_MAX), array_search($b, array_keys($sections), true)]);

        return array_values(array_map(fn (array $s): array => [...$s, 'description' => $s['description'] === '' ? null : $s['description']], $sections));
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
     * @return array{fields: array<int, array<string, mixed>>, sections: list<array{title: string|null, description: string|null, fields: list<string>}>, values: array<string, mixed>, action: string, method: string, submitLabel: string}
     */
    public function toArray(): array
    {
        $defaults = $this->schema()->defaults();

        return [
            'fields' => self::withChoices($this->schema()->toAdmin()),
            'sections' => $this->sections(),
            'values' => array_replace($defaults, array_intersect_key($this->values, array_flip(array_column($this->fields, 'handle')))),
            'action' => $this->action,
            'method' => $this->method,
            'submitLabel' => $this->submitLabel,
        ];
    }

    /**
     * Entries and terms fields with what they can point at as options
     * (`config.options`), so the form offers them as a select: entries of
     * the field's collections (their main language's titles), terms of its
     * taxonomy. At most CHOICES of each.
     *
     * @param  list<array<string, mixed>>  $fields
     * @return list<array<string, mixed>>
     */
    public static function withChoices(array $fields): array
    {
        return array_map(function (array $field): array {
            $config = (array) ($field['config'] ?? []);
            if (($field['type'] ?? null) === 'entries') {
                $collections = array_values(array_filter((array) ($field['collections'] ?? $config['collections'] ?? []), 'is_string'));
                $config['options'] = EntryTranslation::query()->where('locale', Locales::default())
                    ->whereIn('collection_id', Collection::query()->whereIn('handle', $collections)->pluck('id'))->whereHas('entry')
                    ->orderBy('draft_title')->limit(self::CHOICES)->get(['entry_id', 'draft_title'])
                    ->map(fn (EntryTranslation $t): array => ['value' => (string) $t->entry_id, 'label' => $t->draft_title])->all();
            } elseif (($field['type'] ?? null) === 'terms' && is_string($config['taxonomy'] ?? null)) {
                $taxonomy = Taxonomy::query()->where('handle', $config['taxonomy'])->value('id');
                $config['options'] = $taxonomy === null ? [] : Term::query()->where('taxonomy_id', $taxonomy)->with('translations')->orderBy('sort_order')
                    ->limit(self::CHOICES)->get()->map(fn (Term $t): array => ['value' => (string) $t->id, 'label' => $t->title()])->all();
            }
            if (is_array($field['fields'] ?? null)) {
                $field['fields'] = self::withChoices(array_values($field['fields']));
            }

            return ['config' => $config] + $field;
        }, $fields);
    }

    /** @return array<string, mixed> */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
