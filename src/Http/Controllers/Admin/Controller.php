<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Routing\Controller as BaseController;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Catalog\ProductField;
use Sunrice\Commerce\Features\Features;
use Sunrice\Cms\Models\Collection;
use Sunrice\Cms\Support\Access;
use Sunrice\Cms\Fields\Field;

/** Base of the Shop admin controllers. */
abstract class Controller extends BaseController
{
    use AuthorizesRequests;

    /**
     * 403 unless the user may write products: create, edit or edit their
     * own entries of a collection whose blueprint holds the product field.
     */
    protected function authorizeProductEditing(?Authenticatable $user): void
    {
        // Collections whose entries hold the Product data field, where the user may create or edit entries.
        $type = (new ProductField)->type();
        $collections = Collection::query()->get()->filter(fn (Collection $c) => collect($c->schema()->fields())->contains(fn (Field $f) => $f->type === $type));
        abort_unless($user instanceof Authorizable && $collections->contains(fn (Collection $c) => collect(['create', 'update'])
            ->contains(fn (string $action) => Access::entries($user, $action, $c))), 403);
    }

    /**
     * 403 unless the user has at least one of these permissions.
     *
     * @param  array<int, string>  $abilities
     */
    protected function authorizeAny(?Authenticatable $user, array $abilities): void
    {
        abort_unless($user instanceof Authorizable && collect($abilities)->contains(fn (string $a) => $user->can($a)), 403);
    }

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
