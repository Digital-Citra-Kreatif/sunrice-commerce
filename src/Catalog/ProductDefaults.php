<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Cms\Models\Entry;
use Sunrice\Cms\Models\Term;
use Sunrice\Commerce\Settings\StoreSettings;

/** Resolves a product policy and records which scope supplied it. */
final class ProductDefaults
{
    public const MODES = [
        'default' => 'Follow selling mode',
        'cart' => 'Add to cart',
        'inquiry' => 'Inquiry form',
        'whatsapp' => 'Ask on WhatsApp',
        'external' => 'Links to other shops',
        'none' => 'No button',
    ];

    /** @var array<int, list<int>> */
    private array $terms = [];

    public function __construct(private StoreSettings $settings) {}

    /** @param list<int> $entryIds */
    public function preload(array $entryIds): void
    {
        if ($this->rules('category') === [] && $this->rules('brand') === []) {
            return;
        }

        $missing = array_values(array_diff($entryIds, array_keys($this->terms)));
        if ($missing === []) {
            return;
        }

        foreach ($missing as $id) {
            $this->terms[$id] = [];
        }
        foreach (Entry::query()->whereIn('id', $missing)->with('terms:id')->get(['id']) as $entry) {
            $this->terms[$entry->id] = $entry->terms->modelKeys();
        }
    }

    /**
     * @param  list<int>|null  $termIds  Saved draft classifications in admin, or null for published classifications.
     * @return array{value: mixed, source: string, term_id: int|null}
     */
    public function resolve(string $key, ?int $entryId, mixed $product, mixed $store, ?array $termIds = null): array
    {
        if ($product !== null) {
            return ['value' => $product, 'source' => 'product', 'term_id' => null];
        }
        if ($termIds === null && $entryId !== null) {
            $this->preload([$entryId]);
            $termIds = $this->terms[$entryId] ?? [];
        }

        foreach (['brand', 'category'] as $scope) {
            foreach ($this->rules($scope) as $rule) {
                $termId = (int) ($rule['term'] ?? 0);
                $value = $rule[$key] ?? null;
                if (($rule['_hidden'] ?? false) === true || ! in_array($termId, $termIds ?? [], true) || $value === 'inherit') {
                    continue;
                }
                if (in_array($key, ['specifications', 'faq'], true) && is_array($value)) {
                    $value = array_values(array_filter($value, ProductContent::visibleRow(...)));
                }
                if (filled($value)) {
                    return ['value' => $value, 'source' => $scope, 'term_id' => $termId];
                }
            }
        }

        return ['value' => $store, 'source' => 'store', 'term_id' => null];
    }

    /**
     * @param  array<int, mixed>  $links
     * @param  list<int>|null  $termIds
     * @return array{type: string, source: string, source_name: string|null}
     */
    public function purchaseMode(?int $entryId, string $mode = 'default', array $links = [], ?array $termIds = null): array
    {
        $resolved = $this->resolve('purchase_mode', $entryId, $mode === 'default' ? null : $mode,
            $this->settings->get('catalog.default_purchase_mode', 'default'), $termIds);

        return [
            'type' => PurchaseModes::resolve((string) $this->settings->get('general.selling_mode', 'shop'),
                (string) ($resolved['value'] ?? 'default'), commerce_feature('cart'),
                (string) $this->settings->get('catalog.call_to_action', 'inquiry'), $links),
            'source' => $resolved['source'],
            'source_name' => $termIds !== null && $resolved['term_id'] !== null
                ? Term::query()->find($resolved['term_id'])?->title() : null,
        ];
    }

    /** @return array{without_links: array{type: string, source: string, source_name: string|null}, with_links: array{type: string, source: string, source_name: string|null}} */
    public function purchasePreview(?Entry $entry = null): array
    {
        $terms = $entry?->draftTermIds() ?? [];

        return [
            'without_links' => $this->purchaseMode($entry?->id, termIds: $terms),
            'with_links' => $this->purchaseMode($entry?->id, links: [true], termIds: $terms),
        ];
    }

    /** @return list<array<string, mixed>> */
    private function rules(string $scope): array
    {
        return array_values((array) $this->settings->get("catalog.{$scope}_defaults", []));
    }
}
