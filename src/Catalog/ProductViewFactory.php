<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Illuminate\Support\Collection;
use Sunrice\Commerce\Catalog\Models\PriceTier;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Pricing\PricingContext;
use Sunrice\Commerce\Promotions\PriceRules\RuleMatcher;
use Sunrice\Commerce\Promotions\Tiers;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Models\Entry;

/**
 * Builds ProductViews for a page of entries in a fixed number of queries
 * (products, variants with option values and terms, options, tiers). In
 * preview, the draft value is mapped in memory instead.
 */
class ProductViewFactory
{
    /** @var array<int, ProductView|null> entry id => view (per request) */
    protected array $memo = [];

    public function __construct(
        protected StoreSettings $settings,
        protected PriceVisibility $visibility,
        protected CallToAction $cta,
        protected MoneyFormatter $money,
        protected Inventory $inventory,
        protected Catalog $catalog,
    ) {}

    /**
     * Change the displayed current price of a variant for everyone (flash sales, pricing rules).
     *
     * @param  Closure(Variant, int): int  $adjuster
     */
    public static function adjustPricesUsing(Closure $adjuster): void
    {
        app(ProductViewHooks::class)->priceAdjusters[] = $adjuster;
    }

    /**
     * Rebuild views before they are returned (e.g. add flash sale data).
     *
     * @param  Closure(ProductView): ProductView  $extender
     */
    public static function extendUsing(Closure $extender): void
    {
        app(ProductViewHooks::class)->extenders[] = $extender;
    }

    public function forEntry(Entry $entry): ?ProductView
    {
        if ($entry->hydrationContext->preview ?? false) {
            // Drafts are never memoized: the live page must not see them.
            return $this->forEntries(collect([$entry]))[$entry->id] ?? null;
        }
        if (! array_key_exists($entry->id, $this->memo)) {
            $this->forEntries(collect([$entry]));
        }

        return $this->memo[$entry->id] ?? null;
    }

    /**
     * @param  Collection<int, Entry>  $entries
     * @return array<int, ProductView> entry id => view (entries without a product are left out)
     */
    public function forEntries(Collection $entries): array
    {
        $ids = $entries->pluck('id')->all();
        $products = Product::query()->whereIn('entry_id', $ids)->whereNull('removed_at')
            ->with(['variants.optionValues.term.translations', 'options.values.term.translations', 'tiers'])
            ->get()->keyBy('entry_id');

        $views = [];
        foreach ($entries as $entry) {
            $preview = (bool) ($entry->hydrationContext->preview ?? false);
            $product = $products->get($entry->id);
            if ($preview) {
                $draft = (array) ($entry->data ?? []);
                $field = (string) config('commerce.catalog.field', 'product');
                $product = app(ProductProjector::class)->map($draft[$field] ?? null, $product);
                $product->collection_id = $entry->collection_id;
                $product->entry_id = $entry->id;
            }
            if ($product === null) {
                $this->memo[$entry->id] = null; // previews always map a product

                continue;
            }
            $views[$entry->id] = $this->build($entry, $product, $preview);
            if (! $preview) {
                $this->memo[$entry->id] = $views[$entry->id];
            }
        }

        return $views;
    }

    protected function build(Entry $entry, Product $product, bool $preview): ProductView
    {
        $hidden = ! $this->visibility->visible();
        $variants = $product->variants->filter(fn (Variant $v) => $v->active)->values();
        $current = $variants->mapWithKeys(fn (Variant $v) => [$v->uid => $this->currentPrice($product, $v)]);

        // Price display
        $prices = $current->values();
        $from = $prices->min();
        $to = $prices->max();
        $single = $variants->first();
        $regular = $single !== null ? max($this->basePrice($product, $single), (int) $single->compare_at_price) : null;
        $isRange = $from !== null && $from !== $to && $this->settings->get('catalog.price_range', 'range') !== 'min';
        $amount = $isRange ? null : $from;
        $compareAt = ! $isRange && $regular !== null && $amount !== null && $regular > $amount ? $regular : null;
        $formatted = $from === null ? '' : ($isRange
            ? ($this->settings->get('catalog.price_range') === 'from'
                ? __('commerce::storefront.price.from', ['price' => $this->money->format((int) $from)])
                : $this->money->format((int) $from).' – '.$this->money->format((int) $to))
            : $this->money->format((int) $amount));
        $price = [
            'amount' => $hidden ? null : $amount,
            'compareAt' => $hidden ? null : $compareAt,
            'isRange' => $isRange,
            'from' => $hidden ? null : $from,
            'to' => $hidden ? null : $to,
            'hidden' => $hidden,
            'signIn' => $hidden && $this->visibility->signInReveals(),
            'formatted' => $hidden ? '' : $formatted,
            'compareFormatted' => $hidden || $compareAt === null ? null : $this->money->format($compareAt),
            'taxSuffix' => $hidden || ! app(Features::class)->active('taxes') ? null : match ($this->settings->get('taxes.display_prices', 'incl')) {
                'incl' => __('commerce::storefront.price.incl_tax'), 'excl' => __('commerce::storefront.price.excl_tax'), default => null,
            },
        ];

        // Stock
        $statuses = $variants->map(fn (Variant $v) => $this->stockStatus($product, $v));
        $status = $statuses->contains('in_stock') ? 'in_stock' : ($statuses->contains('backorder') ? 'backorder' : 'out_of_stock');
        $quantity = $product->isVariable() ? null : ($single?->track_stock ? (int) $single->stock_quantity : null);
        $stock = ['status' => $status, 'quantity' => $quantity, 'message' => $this->stockMessage($status, $quantity, $single)];

        // Badges
        $badges = [];
        if (! $hidden && ($compareAt !== null || $variants->contains(fn (Variant $v) => $v->compare_at_price > ($current[$v->uid] ?? 0)))) {
            $badges[] = 'sale';
        }
        $newDays = (int) $this->settings->get('catalog.new_badge_days', 14);
        if ($newDays > 0 && $entry->published_at !== null && $entry->published_at->gt(now()->subDays($newDays))) {
            $badges[] = 'new';
        }
        if ($status !== 'in_stock') {
            $badges[] = $status;
        }
        if ($product->featured) {
            $badges[] = 'featured';
        }

        // Picker data
        $options = $product->options->map(fn ($option) => [
            'id' => $option->uid,
            'name' => $option->name,
            'values' => $option->values->map(fn ($value) => ['id' => $value->uid, 'label' => $value->label ?? (string) ($value->term->name ?? '')])->values()->all(),
        ])->values()->all();
        $variantRows = $variants->map(fn (Variant $v) => [
            'id' => $v->id,
            'uid' => $v->uid,
            'title' => $v->title,
            'sku' => $v->sku,
            'options' => $preview ? (array) $v->getAttribute('option_uids') : $v->optionValues->mapWithKeys(fn ($value) => [
                (string) $product->options->firstWhere('id', $value->option_id)?->uid => $value->uid,
            ])->all(),
            'price' => $hidden ? null : $current[$v->uid],
            'price_formatted' => $hidden ? null : $this->money->format($current[$v->uid]),
            'compare_at' => $hidden || $v->compare_at_price === null || $v->compare_at_price <= $current[$v->uid] ? null : $this->money->format($v->compare_at_price),
            'stock' => $this->stockStatus($product, $v),
            'min_qty' => $v->min_qty,
            'max_qty' => $v->max_qty,
            'qty_step' => $v->qty_step,
            'image' => $v->image_asset_id,
        ])->values()->all();

        // Bulk prices for this visitor: the product's tiers and matching pricing rules.
        $tiers = $hidden || $single === null ? [] : $this->tierTable($product, $single, $current[$single->uid] ?? $single->price);

        $view = new ProductView(
            entry: $entry,
            product: $product,
            type: $product->type,
            price: $price,
            badges: $badges,
            stock: $stock,
            cta: $this->cta->for($product),
            tiers: $tiers,
            options: $options,
            variants: $variantRows,
            purchasable: ! $product->syncFailed() && $status !== 'out_of_stock',
        );
        foreach (app(ProductViewHooks::class)->extenders as $extend) {
            $view = $extend($view);
        }

        return $view;
    }

    /**
     * Rows "from N pcs: price" at each tier threshold, for the default variant.
     *
     * @return array<int, array{min_qty: int, label: string, price: string|null}>
     */
    protected function tierTable(Product $product, Variant $variant, int $current): array
    {
        if (! app(Features::class)->active('pricing_rules')) {
            return [];
        }
        $sources = $product->tiers->filter(fn (PriceTier $t) => $t->variant_id === null || $t->variant_id === $variant->id)
            ->map(fn (PriceTier $t) => ['min_qty' => $t->min_qty, 'type' => $t->type, 'value' => $t->value])->values()->all();
        foreach (app(RuleMatcher::class)->for($variant, PricingContext::current()) as $rule) {
            $sources = [...$sources, ...$rule->tiers];
        }
        $thresholds = array_values(array_unique(array_filter(array_map(fn (array $t) => (int) $t['min_qty'], $sources), fn (int $q) => $q > 1)));
        sort($thresholds);
        $rows = [];
        foreach ($thresholds as $qty) {
            $best = Tiers::best($sources, $qty, $variant->price);
            if ($best !== null && $best['price'] < $current) {
                $rows[] = [
                    'min_qty' => $qty,
                    'label' => $variant->price > 0 ? '-'.rtrim(rtrim(number_format(100 * ($variant->price - $best['price']) / $variant->price, 1, ',', '.'), '0'), ',').'%' : '',
                    'price' => $this->money->format($best['price']),
                ];
            }
        }

        return $rows;
    }

    protected function basePrice(Product $product, Variant $variant): int
    {
        return $product->isBundle() ? app(Bundles::class)->price($product, $variant) : $variant->price;
    }

    protected function currentPrice(Product $product, Variant $variant): int
    {
        $price = $this->basePrice($product, $variant);
        foreach (app(ProductViewHooks::class)->priceAdjusters as $adjust) {
            $price = $adjust($variant, $price);
        }

        return $price;
    }

    protected function stockStatus(Product $product, Variant $variant): string
    {
        if ($product->isBundle()) {
            return app(Bundles::class)->available($product) > 0 ? 'in_stock' : 'out_of_stock';
        }
        $available = $this->inventory->available($variant);
        if ($available > 0) {
            return $variant->track_stock && $variant->backorders !== 'no' && (int) $variant->stock_quantity <= 0 ? 'backorder' : 'in_stock';
        }

        return $variant->track_stock && $variant->backorders !== 'no' ? 'backorder' : ($variant->stock_status === 'backorder' ? 'backorder' : 'out_of_stock');
    }

    protected function stockMessage(string $status, ?int $quantity, ?Variant $variant): string
    {
        if ($status !== 'in_stock') {
            return __('commerce::storefront.stock.'.$status);
        }
        $show = (string) $this->settings->get('catalog.show_stock', 'low');
        $threshold = (int) ($variant->low_stock_threshold ?? $this->settings->get('catalog.low_stock_threshold', 5));
        if ($quantity !== null && $show === 'always') {
            return __('commerce::storefront.stock.count', ['count' => $quantity]);
        }
        if ($quantity !== null && $show === 'low' && $quantity <= $threshold) {
            return __('commerce::storefront.stock.low', ['count' => $quantity]);
        }

        return __('commerce::storefront.stock.in_stock');
    }

    public function flush(): void
    {
        $this->memo = [];
    }
}
