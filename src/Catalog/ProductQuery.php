<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Product;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Models\Entry;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Sunrice\Query\EntryQuery;
use Sunrice\Support\Locales;

/**
 * Product listings (ARCHITECTURE.md §7.5): Sunrice decides which entries
 * are live (publication, schedule, language, hidden collections); commerce
 * filters and sorts them by price, stock, sale and attributes, and counts
 * facets over the same filtered set (each facet without its own filter).
 *
 *     ProductQuery::make()->category('shirts')->inStock()->sort('price')->paginate(24);
 *     ProductQuery::fromRequest($request)->facets();
 */
class ProductQuery
{
    public const SORTS = ['featured', 'newest', 'price', '-price', 'best_selling', 'name'];

    protected string $collection;

    /** @var array<string, array<int, int>> taxonomy handle => term ids */
    protected array $terms = [];

    protected ?string $search = null;

    protected ?int $minPrice = null;

    protected ?int $maxPrice = null;

    protected bool $inStock = false;

    protected bool $onSale = false;

    protected bool $featured = false;

    protected string $sort = 'featured';

    /** @var array<int, int>|null */
    protected ?array $entryIds = null;

    public function __construct(?string $collection = null)
    {
        $this->collection = $collection ?? (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products');
        if ((bool) app(StoreSettings::class)->get('catalog.hide_out_of_stock', false)) {
            $this->inStock = true;
        }
    }

    public static function make(?string $collection = null): self
    {
        return new self($collection);
    }

    /**
     * Filters from the query string: category, brand, tag, attr[colors][]=12,
     * q, min_price, max_price (whole currency units), in_stock, on_sale, sort.
     */
    public static function fromRequest(Request $request, ?string $collection = null): self
    {
        $query = new self($collection);
        foreach (['category' => 'category_taxonomy', 'brand' => 'brand_taxonomy', 'tag' => 'tag_taxonomy'] as $param => $config) {
            if (filled($value = $request->query($param)) && ($param !== 'brand' || commerce_feature('brands'))) {
                $query->whereTerms((string) config("commerce.catalog.{$config}"), (array) $value, $param === 'category');
            }
        }
        foreach ((array) $request->query('attr', []) as $taxonomy => $values) {
            if (is_string($taxonomy) && in_array($taxonomy, (array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []), true)) {
                $query->whereTerms($taxonomy, (array) $values);
            }
        }
        if (filled($q = $request->query('q'))) {
            $query->search((string) $q);
        }
        $factor = 10 ** (int) app(StoreSettings::class)->get('general.currency.decimals', 0);
        $min = $request->query('min_price');
        $max = $request->query('max_price');
        $query->price(is_numeric($min) ? (int) round((float) $min * $factor) : null, is_numeric($max) ? (int) round((float) $max * $factor) : null);
        if ($request->boolean('in_stock')) {
            $query->inStock();
        }
        if ($request->boolean('on_sale')) {
            $query->onSale();
        }
        if (in_array($sort = (string) $request->query('sort', ''), self::SORTS, true)) {
            $query->sort($sort);
        }

        return $query;
    }

    // ---- Filters -----------------------------------------------------------

    /** @param  array<int, int|string>|int|string  $terms  ids or slugs */
    public function whereTerms(string $taxonomy, array|int|string $terms, bool $includeChildren = false): self
    {
        $model = Taxonomy::query()->where('handle', $taxonomy)->first();
        if ($model === null) {
            $this->terms[$taxonomy] = [0];

            return $this;
        }
        $ids = [];
        foreach ((array) $terms as $term) {
            $id = is_numeric($term) ? (int) $term : (int) Term::query()->where('taxonomy_id', $model->id)
                ->whereHas('translations', fn ($q) => $q->where('slug', (string) $term))->value('id');
            if ($id > 0) {
                $ids[] = $id;
                if ($includeChildren) {
                    $ids = [...$ids, ...$this->descendants((int) $model->id, $id)];
                }
            }
        }
        $this->terms[$taxonomy] = $ids === [] ? [0] : array_values(array_unique($ids));

        return $this;
    }

    /** @var array<int, array<int, array<int, int>>> taxonomy id => parent id => child ids */
    protected array $trees = [];

    /**
     * A term's descendants, from one query of its taxonomy's tree (rather
     * than one query per subcategory).
     *
     * @return array<int, int>
     */
    protected function descendants(int $taxonomyId, int $id): array
    {
        if (! isset($this->trees[$taxonomyId])) {
            $this->trees[$taxonomyId] = [];
            foreach (Term::query()->where('taxonomy_id', $taxonomyId)->whereNotNull('parent_id')->toBase()->get(['id', 'parent_id']) as $row) {
                $this->trees[$taxonomyId][(int) $row->parent_id][] = (int) $row->id;
            }
        }
        $found = [];
        $queue = [$id];
        while ($queue !== []) {
            foreach ($this->trees[$taxonomyId][array_shift($queue)] ?? [] as $child) {
                if (! in_array($child, $found, true)) {
                    $found[] = $child;
                    $queue[] = $child;
                }
            }
        }

        return $found;
    }

    public function category(int|string $term): self
    {
        return $this->whereTerms((string) config('commerce.catalog.category_taxonomy'), [$term], true);
    }

    public function brand(int|string $term): self
    {
        return $this->whereTerms((string) config('commerce.catalog.brand_taxonomy'), [$term]);
    }

    public function tag(int|string $term): self
    {
        return $this->whereTerms((string) config('commerce.catalog.tag_taxonomy'), [$term]);
    }

    /** Title, summary or SKU. */
    public function search(string $q): self
    {
        $this->search = trim($q) === '' ? null : mb_substr(trim($q), 0, 100);

        return $this;
    }

    /** In minor units. Ignored while prices are hidden from the visitor. */
    public function price(?int $min, ?int $max): self
    {
        [$this->minPrice, $this->maxPrice] = [$min, $max];

        return $this;
    }

    public function inStock(bool $only = true): self
    {
        $this->inStock = $only;

        return $this;
    }

    public function onSale(bool $only = true): self
    {
        $this->onSale = $only;

        return $this;
    }

    public function featured(bool $only = true): self
    {
        $this->featured = $only;

        return $this;
    }

    /** @param  array<int, int>  $ids  limit to these entries (e.g. a wishlist) */
    public function entries(array $ids): self
    {
        $this->entryIds = $ids;

        return $this;
    }

    public function sort(string $sort): self
    {
        $this->sort = in_array($sort, self::SORTS, true) ? $sort : 'featured';

        return $this;
    }

    // ---- Results -----------------------------------------------------------

    /**
     * @param  int|null  $page  null: from the request's ?{$pageName}
     * @return LengthAwarePaginator<int, Entry> entries, in listing order, with views preloaded
     */
    public function paginate(int $perPage = 24, string $pageName = 'page', ?int $page = null): LengthAwarePaginator
    {
        $products = $this->products()->select('commerce_products.entry_id')->paginate($perPage, ['commerce_products.entry_id'], $pageName, $page);
        $ids = $products->getCollection()->pluck('entry_id')->map(fn ($id) => (int) $id)->all();
        $entries = $ids === [] ? collect() : EntryQuery::collection($this->collection)->where('id', 'in', $ids)->get()->keyBy('id');
        $ordered = collect($ids)->map(fn (int $id) => $entries->get($id))->filter()->values();
        app(ProductViewFactory::class)->forEntries($ordered);

        return $products->setCollection($ordered);
    }

    /** @return Collection<int, Entry> */
    public function get(int $limit = 24): Collection
    {
        // Always the first products, whatever ?page the host page has.
        return $this->paginate($limit, page: 1)->getCollection();
    }

    public function count(): int
    {
        return $this->filtered()->count();
    }

    /**
     * Facet counts over the filtered set, each without its own filter:
     * terms per taxonomy (categories, brands, tags, attributes) and price bounds.
     *
     * @return array{terms: array<string, array<int, array{id: int, name: string, slug: string, count: int, selected: bool}>>, price: array{min: int, max: int}|null}
     */
    public function facets(): array
    {
        $taxonomies = array_values(array_filter([
            config('commerce.catalog.category_taxonomy'), commerce_feature('brands') ? config('commerce.catalog.brand_taxonomy') : null, config('commerce.catalog.tag_taxonomy'),
            ...(array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []),
        ]));
        $key = md5(json_encode([$this->state(), $taxonomies, app()->getLocale()]) ?: '');

        return CatalogVersion::remember("facets:{$key}", 300, function () use ($taxonomies) {
            $terms = [];
            $attributes = (array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []);
            foreach ($taxonomies as $handle) {
                $taxonomy = Taxonomy::query()->where('handle', $handle)->first();
                if ($taxonomy === null) {
                    continue;
                }
                $base = $this->filtered(exclude: $handle);
                $counts = in_array($handle, $attributes, true)
                    // Attribute terms come from the variants' option values.
                    ? DB::table('commerce_product_option_values as v')
                        ->join('commerce_product_options as o', 'o.id', '=', 'v.option_id')
                        ->join('commerce_variant_option_values as vov', 'vov.option_value_id', '=', 'v.id')
                        ->join('commerce_variants as var', fn ($j) => $j->on('var.id', '=', 'vov.variant_id')->where('var.active', true)->whereNull('var.deleted_at'))
                        ->whereIn('o.product_id', $base->select('commerce_products.id'))
                        ->whereNotNull('v.term_id')->groupBy('v.term_id')->selectRaw('v.term_id as term_id, count(distinct o.product_id) as total')->pluck('total', 'term_id')
                    : DB::table('sunrice_entry_term')->whereIn('entry_id', $base->select('commerce_products.entry_id'))
                        ->join('sunrice_terms', 'sunrice_terms.id', '=', 'sunrice_entry_term.term_id')->where('sunrice_terms.taxonomy_id', $taxonomy->id)
                        ->groupBy('term_id')->selectRaw('term_id, count(*) as total')->pluck('total', 'term_id');
                if ($counts->isEmpty()) {
                    continue;
                }
                $terms[$handle] = Term::query()->with('translations')->whereIn('id', $counts->keys())->get()
                    ->map(fn (Term $term) => [
                        'id' => $term->id, 'name' => (string) $term->resolveFor(app()->getLocale())->name, 'slug' => (string) $term->slug,
                        'count' => (int) $counts[$term->id], 'selected' => in_array($term->id, $this->terms[$handle] ?? [], true),
                    ])->sortBy('name')->values()->all();
            }

            $price = null;
            if ($this->pricesVisible()) {
                $bounds = $this->filtered(exclude: 'price')->selectRaw('min(min_price) as low, max(max_price) as high')->first();
                if ($bounds !== null && $bounds->getAttribute('low') !== null) {
                    $price = ['min' => (int) $bounds->getAttribute('low'), 'max' => (int) $bounds->getAttribute('high')];
                }
            }

            return ['terms' => $terms, 'price' => $price];
        });
    }

    /**
     * The filters, for cache keys and links.
     *
     * @return array<string, mixed>
     */
    public function state(): array
    {
        return array_filter([
            'collection' => $this->collection, 'terms' => $this->terms, 'q' => $this->search,
            'min' => $this->minPrice, 'max' => $this->maxPrice, 'stock' => $this->inStock, 'sale' => $this->onSale,
            'featured' => $this->featured, 'sort' => $this->sort, 'ids' => $this->entryIds, 'prices' => $this->pricesVisible(),
        ], fn ($v) => $v !== null && $v !== false && $v !== []);
    }

    // ---- Internals ---------------------------------------------------------

    protected function pricesVisible(): bool
    {
        return app(PriceVisibility::class)->visible();
    }

    /** The live entries matching the content filters (Sunrice's own query). */
    protected function liveEntries(?string $exclude = null): QueryBuilder
    {
        $entries = EntryQuery::collection($this->collection);
        foreach ($this->terms as $taxonomy => $ids) {
            if ($taxonomy !== $exclude && ! in_array($taxonomy, (array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []), true)) {
                $entries->whereTerm($taxonomy, $ids);
            }
        }
        if ($this->entryIds !== null) {
            $entries->where('id', 'in', $this->entryIds ?: [0]);
        }

        return $entries->toBase()->reorder()->select('sunrice_entries.id')->toBase();
    }

    /** @return Builder<Product> */
    protected function products(?string $exclude = null): Builder
    {
        return $this->applySort($this->filtered($exclude));
    }

    /** @return Builder<Product> the filtered products, unsorted */
    protected function filtered(?string $exclude = null): Builder
    {
        $query = Product::query()
            ->whereIn('commerce_products.entry_id', $this->liveEntries($exclude))
            ->whereNull('commerce_products.removed_at')
            ->where('commerce_products.sync_status', 'ok');

        if ($this->search !== null) {
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $this->search).'%';
            $matching = EntryQuery::collection($this->collection)->search($this->search, ['title', 'excerpt'])->toBase()->reorder()->select('sunrice_entries.id')->toBase();
            $query->where(fn (Builder $q) => $q->whereIn('commerce_products.entry_id', $matching)
                ->orWhereHas('variants', fn (Builder $v) => $v->whereLike('sku', $like)));
        }
        foreach ($this->terms as $taxonomy => $ids) {
            if ($taxonomy !== $exclude && in_array($taxonomy, (array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []), true)) {
                $query->whereExists(fn (QueryBuilder $q) => $q->from('commerce_variants as var')
                    ->join('commerce_variant_option_values as vov', 'vov.variant_id', '=', 'var.id')
                    ->join('commerce_product_option_values as v', 'v.id', '=', 'vov.option_value_id')
                    ->whereColumn('var.product_id', 'commerce_products.id')->where('var.active', true)->whereNull('var.deleted_at')
                    ->whereIn('v.term_id', $ids));
            }
        }
        if ($exclude !== 'price' && $this->pricesVisible()) {
            $query->when($this->minPrice !== null, fn (Builder $q) => $q->where('commerce_products.max_price', '>=', $this->minPrice))
                ->when($this->maxPrice !== null, fn (Builder $q) => $q->where('commerce_products.min_price', '<=', $this->maxPrice));
        }
        $query->when($this->inStock, fn (Builder $q) => $q->where('commerce_products.in_stock', true))
            ->when($this->onSale && $this->pricesVisible(), fn (Builder $q) => $q->where('commerce_products.on_sale', true))
            ->when($this->featured, fn (Builder $q) => $q->where('commerce_products.featured', true));

        return $query;
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    protected function applySort(Builder $query): Builder
    {
        $sort = in_array($this->sort, ['price', '-price'], true) && ! $this->pricesVisible() ? 'featured' : $this->sort;
        $entries = fn () => $query->join('sunrice_entries as e', 'e.id', '=', 'commerce_products.entry_id');

        match ($sort) {
            'price' => $query->orderBy('commerce_products.min_price'),
            '-price' => $query->orderByDesc('commerce_products.max_price'),
            'best_selling' => $query->orderByDesc('commerce_products.sales_count'),
            'newest' => $entries()->orderByDesc('e.published_at'),
            'name' => $query->join('sunrice_entry_translations as nt', fn ($j) => $j->on('nt.entry_id', '=', 'commerce_products.entry_id')->where('nt.locale', Locales::main()))
                ->orderBy('nt.title'),
            default => $entries()->orderByDesc('commerce_products.featured')->orderBy('e.sort_order')->orderByDesc('e.published_at'),
        };

        return $query->orderBy('commerce_products.id')->select('commerce_products.*');
    }
}
