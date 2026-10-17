<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Contracts\SaleLimits;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Collection;
use Sunrice\Query\EntryQuery;

/**
 * Purchasability (ARCHITECTURE.md §7.3): one place deciding whether a
 * quantity of a variant can be bought, used by the cart, checkout and MCP.
 */
class Catalog
{
    /** @var array<int, bool> entry id => published and visible (per request) */
    protected array $published = [];

    public function __construct(
        protected Features $features,
        protected StoreSettings $settings,
        protected PriceVisibility $prices,
        protected Inventory $inventory,
        protected SaleLimits $saleLimits,
    ) {}

    public function check(Variant $variant, int $qty, mixed $customer = null): Availability
    {
        $product = $variant->product;
        $this->loadPublished([$product]);

        return $this->evaluate($product, $variant, $qty, $customer);
    }

    /**
     * Several lines at once, with one entry query per collection.
     *
     * @param  array<int|string, array{0: Variant, 1: int}>  $lines
     * @return array<int|string, Availability>
     */
    public function checkMany(array $lines, mixed $customer = null): array
    {
        $this->loadPublished(array_map(fn (array $line) => $line[0]->product, $lines));
        $results = [];
        foreach ($lines as $key => [$variant, $qty]) {
            $results[$key] = $this->evaluate($variant->product, $variant, $qty, $customer);
        }

        return $results;
    }

    /** Sunrice decides publication: the entry query returns only published, visible entries. */
    public function isPublished(Product $product): bool
    {
        $this->loadPublished([$product]);

        return $this->published[$product->entry_id] ?? false;
    }

    protected function evaluate(Product $product, Variant $variant, int $qty, mixed $customer): Availability
    {
        if ($product->removed_at !== null || ! ($this->published[$product->entry_id] ?? false)) {
            return new Availability('not_published');
        }
        if ($product->syncFailed()) {
            return new Availability('sync_failed');
        }
        if ($variant->trashed() || ! $variant->active) {
            return new Availability('inactive_variant');
        }
        if (! $this->features->active('cart')) {
            return new Availability('feature_off');
        }
        $mode = PurchaseModes::resolve((string) $this->settings->get('general.selling_mode', 'shop'), $product->purchase_mode, true,
            (string) $this->settings->get('catalog.call_to_action', 'inquiry'), (array) $product->external_links);
        if ($mode !== 'cart') {
            return new Availability('purchase_mode');
        }
        if (! $this->prices->visibleTo($customer)) {
            return new Availability('price_hidden');
        }
        if ($qty < $variant->min_qty || ($variant->max_qty !== null && $qty > $variant->max_qty) || ($qty - $variant->min_qty) % max(1, $variant->qty_step) !== 0) {
            return new Availability('qty_rules', ['min' => $variant->min_qty, 'max' => $variant->max_qty, 'step' => $variant->qty_step]);
        }
        $available = $product->isBundle() ? app(Bundles::class)->available($product) : $this->inventory->available($variant);
        if ($available < $qty) {
            return new Availability('out_of_stock', ['available' => max(0, $available)]);
        }
        $remaining = $this->saleLimits->remaining($variant, $customer);
        if ($remaining !== null && $remaining < $qty) {
            return new Availability('flash_sale_limit', ['available' => max(0, $remaining)]);
        }

        return Availability::ok();
    }

    /** @param  array<int, Product>  $products */
    protected function loadPublished(array $products): void
    {
        $byCollection = [];
        foreach ($products as $product) {
            if (! array_key_exists($product->entry_id, $this->published)) {
                $byCollection[$product->collection_id][] = $product->entry_id;
            }
        }
        foreach ($byCollection as $collectionId => $entryIds) {
            $collection = Collection::query()->find($collectionId);
            $visible = $collection === null ? [] : EntryQuery::forCollection($collection)
                ->where('id', 'in', $entryIds)->toBase()->reorder()->pluck('sunrice_entries.id')->map(fn ($id) => (int) $id)->all();
            foreach ($entryIds as $id) {
                $this->published[$id] = in_array($id, $visible, true);
            }
        }
    }

    /** Forget what this request knows (after publishing). */
    public function flush(): void
    {
        $this->published = [];
    }
}
