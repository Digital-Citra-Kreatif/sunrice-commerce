<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Cms\Fields\Field;
use Sunrice\Cms\Fields\FieldType;
use Sunrice\Cms\Fields\Reference;
use Sunrice\Cms\Fields\Schema;
use Sunrice\Cms\Fields\HydrationContext;
use Sunrice\Cms\Models\Taxonomy;

/**
 * `commerce_product`: a product's commerce data (type, options, variants,
 * prices, stock settings, bundle, downloads, tiers), edited with the
 * product editor control and projected into commerce tables on publish.
 * Shared between languages.
 */
class ProductField extends FieldType
{
    public function type(): string
    {
        return 'commerce_product';
    }

    /** @return list<mixed> */
    public function rules(Field $field): array
    {
        return ['array', function (string $attribute, mixed $value, Closure $fail): void {
            $errors = ProductValue::errors(ProductValue::normalize($value));
            foreach (array_slice($errors, 0, 5, true) as $path => $message) {
                $fail(static::where($path, (array) $value).$message);
            }
        }];
    }

    /**
     * "Variant 2 (SKU): " for a message about variants.1.sku.
     *
     * @param  array<string, mixed>  $value
     */
    protected static function where(string $path, array $value): string
    {
        if (preg_match('/^variants\.(\d+)/', $path, $m) === 1 && ($value['type'] ?? null) === 'variable') {
            $variant = $value['variants'][(int) $m[1]] ?? [];
            $sku = is_array($variant) ? ($variant['sku'] ?? null) : null;

            return 'Variant '.((int) $m[1] + 1).($sku ? " ({$sku})" : '').': ';
        }

        return '';
    }

    public function defaultValue(Field $field): mixed
    {
        return ProductValue::withIds(ProductValue::defaults());
    }

    public function normalize(mixed $value, Field $field): mixed
    {
        return ProductValue::withIds(ProductValue::normalize($value));
    }

    public function hydrate(mixed $value, Field $field, HydrationContext $context): mixed
    {
        return new ProductData($value);
    }

    public function references(mixed $value, Field $field): array
    {
        $value = ProductValue::normalize($value);
        $references = [];
        foreach ($value['variants'] as $i => $variant) {
            if ($variant['image'] !== null) {
                $references[] = new Reference(Reference::MEDIA, (int) $variant['image'], "variants.{$i}.image");
            }
        }
        $componentIds = array_filter(array_column($value['bundle']['items'] ?? [], 'variant_id'));
        if ($componentIds !== []) {
            $entries = Variant::withTrashed()->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
                ->whereIn('commerce_variants.id', $componentIds)->distinct()->pluck('commerce_products.entry_id');
            foreach ($entries as $entryId) {
                $references[] = new Reference(Reference::ENTRY, (int) $entryId, 'bundle');
            }
        }

        return $references;
    }

    public function translatableByDefault(): bool
    {
        return false;
    }

    public function toAdmin(Field $field, Schema $schema): array
    {
        return ['translatable' => false, 'config' => [
            ...(array) $field->config,
            'max_options' => (int) config('commerce.catalog.max_options', 3),
            'max_variants' => (int) config('commerce.catalog.max_variants', 100),
            'link_presets' => ProductValue::LINK_PRESETS,
            'attribute_taxonomies' => Taxonomy::query()
                ->whereIn('handle', (array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []))
                ->orderBy('title')->get(['handle', 'title'])->toArray(),
            'tax_classes' => (array) app(StoreSettings::class)->get('taxes.classes', ['standard']),
            'features' => app(Features::class)->states(),
        ]] + parent::toAdmin($field, $schema);
    }
}
