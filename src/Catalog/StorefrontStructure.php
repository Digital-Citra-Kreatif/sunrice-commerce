<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Collection;
use Sunrice\Cms\Models\Collection as CatalogCollection;
use Sunrice\Cms\Models\Taxonomy;
use Sunrice\Cms\Models\Term;

/** Reuse CMS structure models while rendering one storefront request. */
final class StorefrontStructure
{
    /** @var Collection<string, CatalogCollection>|null */
    private ?Collection $collections = null;

    /** @var Collection<string, Taxonomy>|null */
    private ?Collection $taxonomies = null;

    public function collection(string $handle): ?CatalogCollection
    {
        $this->collections ??= CatalogCollection::query()->get()->keyBy('handle');

        return $this->collections->get($handle);
    }

    public function taxonomy(string $handle): ?Taxonomy
    {
        $this->taxonomies ??= Taxonomy::query()->get()->keyBy('handle');

        return $this->taxonomies->get($handle);
    }

    /**
     * @param  Collection<int, Term>  $categories
     * @return array<int, array<int, string>>
     */
    public function categoryPaths(Collection $categories): array
    {
        $known = $frontier = $categories->keyBy('id');
        $queried = $known->keys();
        while ($frontier->isNotEmpty()) {
            $parents = $frontier->pluck('parent_id')->filter()->unique()->diff($queried);
            if ($parents->isEmpty()) {
                break;
            }
            $frontier = Term::query()->with('translations')->whereKey($parents->all())->get()->keyBy('id');
            $known = $known->union($frontier);
            $queried = $queried->concat($parents);
        }

        $labels = [];
        foreach ($categories as $category) {
            $path = [];
            for ($node = $category; $node !== null && ! isset($path[$node->id]); $node = $known->get($node->parent_id ?? 0)) {
                $path[$node->id] = $node->title();
            }
            $labels[$category->id] = array_reverse($path, true);
        }

        return $labels;
    }
}
