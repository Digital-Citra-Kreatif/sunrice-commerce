<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Fields\FieldType;
use Sunrice\Fields\HydrationContext;

/**
 * `commerce_product`: a product's commerce data (type, options, variants,
 * prices, stock settings, bundle, downloads, tiers), edited with the
 * product editor control and projected into commerce tables on publish.
 * Shared between languages.
 */
class ProductField extends FieldType
{
    public static function type(): string
    {
        return 'commerce_product';
    }

    public function rules(array $field): array
    {
        return ['array', function (string $attribute, mixed $value, Closure $fail): void {
            $errors = ProductValue::errors(ProductValue::normalize($value));
            foreach (array_slice($errors, 0, 5, true) as $path => $message) {
                $fail(static::where($path, (array) $value).$message);
            }
        }];
    }

    /** "Variant M / Red: " for a message about variants.3.sku. */
    protected static function where(string $path, array $value): string
    {
        if (preg_match('/^variants\.(\d+)/', $path, $m) === 1 && ($value['type'] ?? null) === 'variable') {
            $variant = $value['variants'][(int) $m[1]] ?? [];
            $sku = is_array($variant) ? ($variant['sku'] ?? null) : null;

            return 'Variant '.((int) $m[1] + 1).($sku ? " ({$sku})" : '').': ';
        }

        return '';
    }

    public function defaultValue(array $field): mixed
    {
        return ProductValue::withIds(ProductValue::defaults());
    }

    public function normalize(mixed $value, array $field): mixed
    {
        return ProductValue::withIds(ProductValue::normalize($value));
    }

    public function hydrate(mixed $value, array $field, HydrationContext $ctx): mixed
    {
        return new ProductData($value);
    }

    public function references(mixed $value, array $field): array
    {
        $value = ProductValue::normalize($value);
        $references = [];
        foreach ($value['variants'] as $i => $variant) {
            if ($variant['image'] !== null) {
                $references[] = ['target_type' => 'asset', 'target_id' => $variant['image'], 'field_path' => "variants.{$i}.image"];
            }
        }
        $componentIds = array_filter(array_column($value['bundle']['items'] ?? [], 'variant_id'));
        if ($componentIds !== []) {
            $entries = Variant::withTrashed()->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
                ->whereIn('commerce_variants.id', $componentIds)->distinct()->pluck('commerce_products.entry_id');
            foreach ($entries as $entryId) {
                $references[] = ['target_type' => 'entry', 'target_id' => (int) $entryId, 'field_path' => 'bundle'];
            }
        }

        return $references;
    }

    public function translatableByDefault(): bool
    {
        return false;
    }

    public function toAdminSchema(array $field): array
    {
        $field['translatable'] = false;
        $field['config'] = [
            ...($field['config'] ?? []),
            'max_options' => (int) config('commerce.catalog.max_options', 3),
            'max_variants' => (int) config('commerce.catalog.max_variants', 100),
            'link_presets' => ProductValue::LINK_PRESETS,
        ];

        return $field;
    }
}
