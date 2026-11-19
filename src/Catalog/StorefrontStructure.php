<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Illuminate\Support\Collection;
use Sunrice\Cms\Models\Collection as CatalogCollection;
use Sunrice\Cms\Models\Taxonomy;

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
}
