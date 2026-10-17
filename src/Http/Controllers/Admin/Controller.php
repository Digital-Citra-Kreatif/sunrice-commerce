<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller as BaseController;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Features\Features;

/** Base of the Shop admin controllers. */
abstract class Controller extends BaseController
{
    use AuthorizesRequests;

    /** 404 while the module is inactive (its pages don't exist then). */
    protected function authorizeFeature(string $feature): void
    {
        abort_unless(app(Features::class)->active($feature), 404);
    }

    /**
     * Props for Sunrice's DataTable (window.Sunrice.components.DataTable).
     *
     * @param  array<int, Column>  $columns
     * @param  LengthAwarePaginator<int, mixed>  $rows  already mapped to arrays
     * @param  array<int, array<string, mixed>>  $filters
     * @param  array<int, array<string, mixed>>  $bulkActions
     * @return array<string, mixed>
     */
    protected function tableProps(string $key, TableQuery $table, array $columns, LengthAwarePaginator $rows, array $filters = [], array $bulkActions = []): array
    {
        return [
            'tableKey' => $key,
            'columns' => $columns,
            'rows' => $rows,
            'meta' => $table->meta(),
            'filters' => $filters,
            'bulkActions' => $bulkActions,
        ];
    }
}
