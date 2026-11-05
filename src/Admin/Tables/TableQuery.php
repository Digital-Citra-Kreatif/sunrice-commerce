<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Tables;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * A list page's query from its request: `?search=` over the searchable
 * columns, `?filters[key]=` through each filter's closure, `?sort=` (a
 * sortable column, `-` first for descending) and `?per_page=` (10–200).
 *
 *     $table = TableQuery::for(Voucher::query())->searchable(['code', 'name'])
 *         ->filter('kind', fn (Builder $q, string $v) => $q->where('automatic', $v === 'automatic'))
 *         ->sortable(['code', 'ends_at'])->apply($request);
 *     $rows = $table->defaultPerPage(25)->paginate($request);
 */
final class TableQuery
{
    public const PER_PAGE = [10, 25, 50, 100, 200];

    /** @var list<string> */
    private array $searchable = [];

    /** @var array<string, Closure(Builder<covariant Model>, string): mixed> */
    private array $filters = [];

    /** @var list<string> */
    private array $sortable = [];

    private int $perPage = 25;

    /** @var array{search: string|null, sort: string|null, direction: string, filters: array<string, string>, perPage: int} */
    private array $meta = ['search' => null, 'sort' => null, 'direction' => 'asc', 'filters' => [], 'perPage' => 25];

    /** @param Builder<covariant Model> $builder */
    private function __construct(private Builder $builder) {}

    /** @param  Builder<covariant Model>  $builder */
    public static function for(Builder $builder): self
    {
        return new self($builder);
    }

    /** @var (Closure(Builder<covariant Model>, string): mixed)|null */
    private ?Closure $search = null;

    /** Search with a closure of its own instead of searchable() columns. @param Closure(Builder<covariant Model>, string): mixed $search */
    public function searchUsing(Closure $search): self
    {
        $this->search = $search;

        return $this;
    }

    /** @param list<string> $columns */
    public function searchable(array $columns): self
    {
        $this->searchable = $columns;

        return $this;
    }

    /** @param Closure(Builder<covariant Model>, string): mixed $apply */
    public function filter(string $key, Closure $apply): self
    {
        $this->filters[$key] = $apply;

        return $this;
    }

    /** @param list<string> $columns */
    public function sortable(array $columns): self
    {
        $this->sortable = $columns;

        return $this;
    }

    public function apply(Request $request): self
    {
        $search = trim((string) $request->query('search', ''));
        if ($search !== '' && $this->search !== null) {
            ($this->search)($this->builder, mb_substr($search, 0, 100));
            $this->meta['search'] = $search;
        } elseif ($search !== '' && $this->searchable !== []) {
            $like = '%'.str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], mb_substr($search, 0, 100)).'%';
            $this->builder->where(function (Builder $q) use ($like): void {
                foreach ($this->searchable as $column) {
                    $q->orWhereLike($column, $like);
                }
            });
            $this->meta['search'] = $search;
        }
        $filters = $request->query('filters');
        foreach (is_array($filters) ? $filters : [] as $key => $value) {
            if (is_string($key) && isset($this->filters[$key]) && is_scalar($value) && (string) $value !== '') {
                ($this->filters[$key])($this->builder, (string) $value);
                $this->meta['filters'][$key] = (string) $value;
            }
        }
        $sort = (string) $request->query('sort', '');
        $column = ltrim($sort, '-');
        if ($column !== '' && in_array($column, $this->sortable, true)) {
            $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
            $this->builder->reorder()->orderBy($column, $direction);
            $this->meta['sort'] = $column;
            $this->meta['direction'] = $direction;
        }

        return $this;
    }

    /** @return array{search: string|null, sort: string|null, direction: string, filters: array<string, string>, perPage: int} */
    public function meta(): array
    {
        return $this->meta;
    }

    /** @return Builder<covariant Model> */
    public function builder(): Builder
    {
        return $this->builder;
    }

    public function defaultPerPage(int $perPage): self
    {
        $this->perPage = $perPage;

        return $this;
    }

    /** @return LengthAwarePaginator<int, Model> */
    public function paginate(Request $request): LengthAwarePaginator
    {
        $asked = (int) $request->query('per_page', (string) $this->perPage);
        $this->meta['perPage'] = in_array($asked, self::PER_PAGE, true) ? $asked : $this->perPage;

        return $this->builder->paginate($this->meta['perPage'])->withQueryString();
    }
}
