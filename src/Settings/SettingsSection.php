<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Settings;

use Closure;

/**
 * A section of Settings → Store (General, Checkout, an extension's own…).
 *
 * - $fields: Sunrice field definitions (rendered by the admin's
 *   FieldRenderer); each handle is a key of the section's stored values.
 * - $rules: Laravel validation rules for those values.
 * - $permission: who may open and save it (default commerce.settings.<key>).
 * - $feature: the module the section belongs to; hidden while inactive.
 * - $page: an Inertia page of its own instead of the schema form.
 * - $check: fn (array $values, StoreSettings $current): ?string — a reason
 *   to refuse the save (cross-checks between settings).
 */
class SettingsSection
{
    /**
     * @param  array<int, array<string, mixed>>|Closure(): array<int, array<string, mixed>>  $fields
     * @param  array<string, mixed>|Closure(): array<string, mixed>  $rules
     * @param  (Closure(array<string, mixed>, StoreSettings): ?string)|null  $check
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        protected array|Closure $fields = [],
        protected array|Closure $rules = [],
        public readonly ?string $feature = null,
        protected ?string $permission = null,
        public readonly ?string $page = null,
        public readonly int $position = 100,
        protected ?Closure $check = null,
    ) {}

    public function permission(): string
    {
        return $this->permission ?? 'commerce.settings.'.$this->key;
    }

    /** @return array<int, array<string, mixed>> */
    public function fields(): array
    {
        return $this->fields instanceof Closure ? ($this->fields)() : $this->fields;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return $this->rules instanceof Closure ? ($this->rules)() : $this->rules;
    }

    /** @param  array<string, mixed>  $values */
    public function check(array $values, StoreSettings $current): ?string
    {
        return $this->check === null ? null : ($this->check)($values, $current);
    }
}
