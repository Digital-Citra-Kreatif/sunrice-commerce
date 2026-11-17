<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog\Csv;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Cms\Actions\Entries\CreateEntry;
use Sunrice\Cms\Actions\Entries\PublishEntry;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Models\EntryTranslation;
use Sunrice\Cms\Models\Taxonomy;
use Sunrice\Cms\Models\Term;
use Sunrice\Cms\Support\Access;
use Sunrice\Commerce\Support\ActivityRecorder;

/**
 * The product import's "create" half: rows whose SKU no product has, with
 * a product title, become new products. Rows with the same title are one
 * product, its variants told apart by the variant column (one option, named
 * by the option column, "Size" by default); a title on one row without a
 * variant is a simple product. New products are drafts unless published.
 */
class ProductCsvCreator
{
    /** @var array<string, int|null> category cell => term id */
    protected array $terms = [];

    /**
     * What a row would create, or why it can't.
     *
     * @param  array<string, string|null>  $cells
     * @param  callable(string, string, bool): int  $minor  ProductCsv's amount reader
     * @param  callable(string, string): int  $whole
     * @param  callable(string): bool  $bool
     * @return array<string, mixed>
     */
    public function row(array $cells, Authorizable $user, callable $minor, callable $whole, callable $bool): array
    {
        $collection = $this->collection();
        if ($collection === null || ! Access::entries($user, 'create', $collection)) {
            throw new \InvalidArgumentException('You may not create products.');
        }
        $title = trim((string) ($cells['product'] ?? ''));
        if (mb_strlen($title) > 190) {
            throw new \InvalidArgumentException('product: the title is longer than 190 characters.');
        }
        $price = trim((string) ($cells['price'] ?? ''));
        if ($price === '') {
            throw new \InvalidArgumentException('A new product needs a price.');
        }
        $stock = trim((string) ($cells['stock'] ?? ''));
        $category = trim((string) ($cells['category'] ?? ''));
        $termId = $category !== '' ? $this->term($category) : null;
        if ($category !== '' && $termId === null) {
            throw new \InvalidArgumentException("category: no category is called \"{$category}\".");
        }
        $compareAt = trim((string) ($cells['compare_at_price'] ?? '')) !== '' ? $minor(trim((string) $cells['compare_at_price']), 'compare_at_price', true) : 0;
        $row = [
            'product' => $title,
            'variant' => trim((string) ($cells['variant'] ?? '')),
            'option' => trim((string) ($cells['option'] ?? '')) ?: 'Size',
            'price' => $minor($price, 'price', true),
            'compare_at_price' => $compareAt ?: null,
            'cost' => trim((string) ($cells['cost'] ?? '')) !== '' ? ($minor(trim((string) $cells['cost']), 'cost', true) ?: null) : null,
            'weight' => trim((string) ($cells['weight'] ?? '')) !== '' ? $whole(trim((string) $cells['weight']), 'weight') : null,
            'stock' => $stock !== '' ? $whole($stock, 'stock') : null,
            'active' => trim((string) ($cells['active'] ?? '')) !== '' ? $bool(trim((string) $cells['active'])) : true,
            'category' => $termId,
        ];
        if ($row['compare_at_price'] !== null && $row['compare_at_price'] <= $row['price']) {
            throw new \InvalidArgumentException('The compare-at price must be above the price.');
        }

        return $row;
    }

    /**
     * Rows of one product must each name their variant, and differently.
     *
     * @param  list<array<string, mixed>>  $rows  preview rows
     * @return list<array<string, mixed>>
     */
    public function check(array $rows): array
    {
        $groups = [];
        foreach ($rows as $i => $row) {
            if (($row['create'] ?? null) !== null && $row['error'] === null) {
                $groups[mb_strtolower((string) $row['create']['product'])][] = $i;
            }
        }
        foreach ($groups as $indexes) {
            if (count($indexes) < 2) {
                continue;
            }
            $seen = [];
            foreach ($indexes as $i) {
                $variant = mb_strtolower((string) $rows[$i]['create']['variant']);
                $rows[$i]['error'] = match (true) {
                    $variant === '' => 'This product has several rows: each needs a variant (S, M…).',
                    isset($seen[$variant]) => "Variant \"{$rows[$i]['create']['variant']}\" is on line {$seen[$variant]} too.",
                    default => null,
                };
                $seen[$variant] ??= $rows[$i]['line'];
            }
        }

        return $rows;
    }

    /**
     * Creates the products of a preview's create rows.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return int products created
     */
    public function create(array $rows, Authorizable $user, bool $publish): int
    {
        $collection = $this->collection();
        if ($collection === null || ! Access::entries($user, 'create', $collection)) {
            return 0;
        }
        $groups = [];
        foreach ($rows as $row) {
            if (($row['create'] ?? null) !== null && $row['error'] === null) {
                $groups[mb_strtolower((string) $row['create']['product'])][] = $row;
            }
        }
        $created = 0;
        foreach ($groups as $group) {
            DB::transaction(function () use ($group, $collection, $publish, $user): void {
                $first = $group[0]['create'];
                $translation = app(CreateEntry::class)->handle($collection, array_filter([
                    'title' => $first['product'],
                    'slug' => $this->slug($collection, (string) $first['product']),
                    'data' => ['product' => $this->value($group)],
                    'terms' => $first['category'] !== null ? [(string) config('commerce.catalog.category_taxonomy') => [$first['category']]] : null,
                ], fn ($v) => $v !== null));
                if ($publish && Access::entries($user, 'publish', $collection)) {
                    app(PublishEntry::class)->handle($translation->fresh() ?? $translation);
                }
            });
            $created++;
        }
        if ($created > 0) {
            app(ActivityRecorder::class)->record('imported', $created === 1 ? '1 new product' : "{$created} new products", ['created' => $created], 'products');
        }

        return $created;
    }

    /**
     * The product field's value for a group of rows.
     *
     * @param  list<array<string, mixed>>  $group
     * @return array<string, mixed>
     */
    protected function value(array $group): array
    {
        $variant = fn (array $row, array $extra = []): array => array_filter([
            'id' => Str::lower(Str::random(8)), 'sku' => $row['sku'], 'price' => $row['create']['price'],
            'compare_at_price' => $row['create']['compare_at_price'], 'cost' => $row['create']['cost'], 'weight' => $row['create']['weight'],
            'track_stock' => $row['create']['stock'] !== null, 'initial_stock' => $row['create']['stock'], 'active' => $row['create']['active'],
            ...$extra,
        ], fn ($v) => $v !== null);
        if (count($group) === 1 && $group[0]['create']['variant'] === '') {
            return ['type' => 'simple', 'variants' => [$variant($group[0])]];
        }
        $values = [];
        $variants = [];
        foreach ($group as $row) {
            $id = Str::slug((string) $row['create']['variant']) ?: Str::lower(Str::random(6));
            $values[] = ['id' => $id, 'label' => $row['create']['variant']];
            $variants[] = $variant($row, ['options' => ['opt' => $id]]);
        }

        return ['type' => 'variable', 'options' => [['id' => 'opt', 'name' => $group[0]['create']['option'], 'values' => $values]], 'variants' => $variants];
    }

    protected function collection(): ?Collection
    {
        return Collection::query()->where('handle', (string) (config('commerce.catalog.collections', ['products'])[0] ?? 'products'))->first();
    }

    protected function slug(Collection $collection, string $title): string
    {
        $base = Str::slug($title) ?: 'product';
        $slug = $base;
        $taken = fn (string $slug) => EntryTranslation::query()->where('collection_id', $collection->id)
            ->where(fn ($q) => $q->where('slug', $slug)->orWhere('draft_slug', $slug))->exists();
        for ($n = 2; $taken($slug); $n++) {
            $slug = "{$base}-{$n}";
        }

        return $slug;
    }

    /** A category by its name or slug, in any language. */
    protected function term(string $cell): ?int
    {
        $key = mb_strtolower($cell);
        if (! array_key_exists($key, $this->terms)) {
            $taxonomy = Taxonomy::query()->where('handle', (string) config('commerce.catalog.category_taxonomy'))->first();
            $match = $taxonomy === null ? null : Term::query()->with('translations')->where('taxonomy_id', $taxonomy->id)->get()
                ->first(fn (Term $t) => $t->translations->contains(fn ($tr) => mb_strtolower((string) $tr->title) === $key || mb_strtolower((string) $tr->slug) === $key));
            $this->terms[$key] = $match?->id;
        }

        return $this->terms[$key];
    }
}
