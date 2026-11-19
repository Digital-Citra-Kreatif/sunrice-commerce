<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Sunrice\Commerce\Catalog\Models\Product;

/**
 * Catalog filters of extensions (Commerce::registerCatalogFilter()): each
 * reads its value from the listing's query string and narrows the products.
 * ProductQuery applies them to listings and facet counts.
 */
final class CatalogFilters
{
    /** @var array<string, array{read: Closure(Request): mixed, apply: Closure(Builder<Product>, mixed): void}> */
    protected array $filters = [];

    /**
     * @param  Closure(Request): mixed  $read  the filter's value from the request, or null when it isn't set
     * @param  Closure(Builder<Product>, mixed): void  $apply  narrows the products query to those matching the value
     */
    public function register(string $key, Closure $read, Closure $apply): void
    {
        $this->filters[$key] = ['read' => $read, 'apply' => $apply];
    }

    /** @return array<string, mixed> key => value, for the filters set in this request */
    public function fromRequest(Request $request): array
    {
        $values = [];
        foreach ($this->filters as $key => $filter) {
            $value = ($filter['read'])($request);
            if ($value !== null && $value !== [] && $value !== '') {
                $values[$key] = $value;
            }
        }

        return $values;
    }

    public function has(string $key): bool
    {
        return isset($this->filters[$key]);
    }

    /** @param  Builder<Product>  $query */
    public function apply(string $key, Builder $query, mixed $value): void
    {
        if (isset($this->filters[$key])) {
            ($this->filters[$key]['apply'])($query, $value);
        }
    }
}
