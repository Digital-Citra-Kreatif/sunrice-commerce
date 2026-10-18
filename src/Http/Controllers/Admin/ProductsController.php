<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Catalog\Actions\UpdateProductValues;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;
use Sunrice\Models\Scopes\HiddenWithParent;
use Sunrice\Models\Taxonomy;
use Sunrice\Models\Term;
use Sunrice\Support\Locales;

/** Shop → Products: product entries with their commerce data; rows open Sunrice's entry editor. */
class ProductsController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $collections = $this->collections($request);
        abort_if($collections->isEmpty(), 403);

        $query = Entry::query()->withTrashed()->withoutGlobalScope(HiddenWithParent::class)
            ->select('sunrice_entries.*', 't.title as product_title', 'p.type', 'p.min_price', 'p.max_price', 'p.in_stock', 'p.featured', 'p.sync_status', 'p.sync_error', 'p.id as product_id')
            ->whereIn('sunrice_entries.collection_id', $collections->pluck('id'))
            ->leftJoin('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'sunrice_entries.id')->where('t.locale', Locales::main()))
            ->leftJoin('commerce_products as p', 'p.entry_id', '=', 'sunrice_entries.id')
            ->with(['terms.translations', 'collection:id,handle', 'translations' => fn ($q) => $q->where('locale', Locales::main())]);

        $table = TableQuery::for($query)
            // Title or SKU.
            ->searchUsing(function (Builder $q, string $term): void {
                $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';
                $q->where(fn (Builder $w) => $w->whereLike('t.title', $like)
                    ->orWhereIn('p.id', fn ($s) => $s->from('commerce_variants')->select('product_id')->whereLike('sku', $like)));
            })
            ->filter('type', fn (Builder $q, mixed $v) => $q->where('p.type', $v))
            ->filter('stock', fn (Builder $q, mixed $v) => $q->where('p.in_stock', $v === 'in'))
            ->filter('sync', fn (Builder $q, mixed $v) => $q->where('p.sync_status', 'failed'))
            ->filter('state', fn (Builder $q, mixed $v) => match ($v) {
                'published' => $q->whereNull('sunrice_entries.deleted_at')->where('status', 'published')->where('sunrice_entries.published_at', '<=', now()),
                'scheduled' => $q->whereNull('sunrice_entries.deleted_at')->where('status', 'published')->where('sunrice_entries.published_at', '>', now()),
                'draft' => $q->whereNull('sunrice_entries.deleted_at')->where('status', '!=', 'published'),
                'trashed' => $q->whereNotNull('sunrice_entries.deleted_at'),
                default => $q,
            })
            ->filter('category', fn (Builder $q, mixed $v) => $q->whereHas('terms', fn ($t) => $t->where('sunrice_terms.id', (int) $v)))
            ->filter('brand', fn (Builder $q, mixed $v) => $q->whereHas('terms', fn ($t) => $t->where('sunrice_terms.id', (int) $v)))
            ->sortable(['product_title', 'min_price', 'published_at'])
            ->apply($request);
        if (! $request->filled('filters.state')) {
            $table->builder()->whereNull('sunrice_entries.deleted_at');
        }
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderBy('sunrice_entries.sort_order')->orderByDesc('sunrice_entries.id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);
        $variantsByProduct = Variant::query()
            ->whereIn('product_id', $rows->getCollection()->pluck('product_id')->filter())
            ->orderBy('position')->get(['product_id', 'sku', 'track_stock', 'stock_quantity'])->groupBy('product_id');

        $categories = $this->termOptions((string) config('commerce.catalog.category_taxonomy'));
        $brands = $this->termOptions((string) config('commerce.catalog.brand_taxonomy'));
        $categoryTaxonomy = Taxonomy::query()->where('handle', config('commerce.catalog.category_taxonomy'))->value('id');
        $user = $request->user();

        return Inertia::render('Commerce/Products/Index', [
            ...$this->tableProps('commerce-products', $table, [
                new Column('product_title', 'Product', sortable: true),
                new Column('type', 'Type', type: 'badge'),
                new Column('sku', 'SKU'),
                new Column('min_price', 'Price', sortable: true),
                new Column('stock', 'Stock'),
                new Column('state', 'Status', type: 'badge'),
                new Column('categories', 'Categories'),
            ], $rows->through(function (Model $entry) use ($money, $categoryTaxonomy, $user, $variantsByProduct) {
                if (! $entry instanceof Entry) {
                    throw new \LogicException('Expected an entry.');
                }
                $variants = $variantsByProduct->get($entry->getAttribute('product_id')) ?? collect();
                $min = $entry->getAttribute('min_price');
                $max = $entry->getAttribute('max_price');

                return [
                    'id' => $entry->id,
                    'product_title' => $entry->getAttribute('product_title') ?: "Entry #{$entry->id}",
                    'href' => "collections/{$entry->collection->handle}/entries/{$entry->id}/edit",
                    'type' => $entry->getAttribute('type') ?? 'not published',
                    'sku' => $variants->count() > 1 ? $variants->count().' variants' : $variants->first()?->sku,
                    'min_price' => $min === null ? null : ($min === $max ? $money->format((int) $min) : $money->format((int) $min).' – '.$money->format((int) $max)),
                    'stock' => $variants->contains('track_stock', true) ? (string) $variants->sum('stock_quantity') : ($entry->getAttribute('in_stock') === null ? null : ($entry->getAttribute('in_stock') ? 'In stock' : 'Out of stock')),
                    'in_stock' => $entry->getAttribute('in_stock') === null ? null : (bool) $entry->getAttribute('in_stock'),
                    'featured' => (bool) $entry->getAttribute('featured'),
                    'state' => match (true) {
                        $entry->trashed() => 'trashed',
                        $entry->status !== 'published' => 'draft',
                        $entry->published_at?->isFuture() ?? false => 'scheduled',
                        default => 'published',
                    },
                    'sync_failed' => $entry->getAttribute('sync_status') === 'failed',
                    'sync_error' => $entry->getAttribute('sync_error'),
                    'categories' => $entry->terms->where('taxonomy_id', $categoryTaxonomy)->map(fn ($t) => $t->translations->firstWhere('locale', Locales::main())->name ?? '')->values()->implode(', '),
                    'can_edit' => $user->can('update', $entry),
                ];
            }), [
                ['key' => 'type', 'label' => 'Type', 'type' => 'select', 'options' => [['value' => 'simple', 'label' => 'Simple'], ['value' => 'variable', 'label' => 'Variable'], ['value' => 'bundle', 'label' => 'Bundle']]],
                ['key' => 'stock', 'label' => 'Stock', 'type' => 'select', 'options' => [['value' => 'in', 'label' => 'In stock'], ['value' => 'out', 'label' => 'Out of stock']]],
                ['key' => 'state', 'label' => 'Status', 'type' => 'select', 'options' => [['value' => 'published', 'label' => 'Published'], ['value' => 'draft', 'label' => 'Draft'], ['value' => 'scheduled', 'label' => 'Scheduled'], ['value' => 'trashed', 'label' => 'Trashed']]],
                ['key' => 'sync', 'label' => 'Problems', 'type' => 'select', 'options' => [['value' => 'failed', 'label' => "Can't be bought (sync failed)"]]],
                ...($categories !== [] ? [['key' => 'category', 'label' => 'Category', 'type' => 'select', 'options' => $categories]] : []),
                ...($brands !== [] ? [['key' => 'brand', 'label' => 'Brand', 'type' => 'select', 'options' => $brands]] : []),
            ], [
                ['key' => 'featured', 'label' => 'Mark featured'],
                ['key' => 'unfeatured', 'label' => 'Unmark featured'],
                ['key' => 'in_stock', 'label' => 'Set in stock'],
                ['key' => 'out_of_stock', 'label' => 'Set out of stock', 'confirm' => 'Mark the selected products out of stock? Variants that track stock keep their counts.'],
            ]),
            'bulkUrl' => route('sunrice.admin.commerce.products.bulk', [], false),
            'createUrl' => "collections/{$collections->first()->handle}/entries/create",
        ]);
    }

    public function bulk(Request $request, UpdateProductValues $update): RedirectResponse
    {
        $data = $request->validate([
            'action' => ['required', Rule::in(['featured', 'unfeatured', 'in_stock', 'out_of_stock'])],
            'ids' => ['required', 'array', 'max:200'],
            'ids.*' => ['integer'],
        ]);
        $collections = $this->collections($request)->pluck('id');
        $entries = Entry::query()->whereIn('collection_id', $collections)->whereIn('id', $data['ids'])->with('translations')->get();
        $done = 0;
        foreach ($entries as $entry) {
            if (! $request->user()->can('update', $entry)) {
                continue;
            }
            $update->handle($entry, fn (array $value) => match ($data['action']) {
                'featured', 'unfeatured' => [...$value, 'featured' => $data['action'] === 'featured'],
                default => [...$value, 'variants' => array_map(fn (array $v) => $v['track_stock'] ? $v : [...$v, 'stock_status' => $data['action']], $value['variants'])],
            });
            $done++;
        }

        return back()->with('success', $done === 1 ? '1 product updated.' : "{$done} products updated.");
    }

    /**
     * Product collections whose entries the user may see.
     *
     * @return \Illuminate\Support\Collection<int, Collection>
     */
    protected function collections(Request $request): \Illuminate\Support\Collection
    {
        return Collection::query()->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->get()
            ->filter(fn (Collection $c) => $request->user()->can('viewAny', [Entry::class, $c->id]))->values();
    }

    /** @return array<int, array{value: string, label: string}> */
    protected function termOptions(string $taxonomy): array
    {
        $model = Taxonomy::query()->where('handle', $taxonomy)->first();

        return $model === null ? [] : Term::query()->where('taxonomy_id', $model->id)->with('translations')->get()
            ->map(fn ($t) => ['value' => (string) $t->id, 'label' => (string) ($t->translations->firstWhere('locale', Locales::main())->name ?? $t->id)])
            ->sortBy('label')->values()->all();
    }
}
