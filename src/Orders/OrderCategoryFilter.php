<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\StorefrontStructure;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;

final class OrderCategoryFilter
{
    public function __construct(private StorefrontStructure $structure) {}

    /**
     * @param  Builder<Order>  $orders  the customer's unfiltered orders
     * @return array<int, array{label: string, terms: list<int>}>
     */
    public function options(Builder $orders): array
    {
        $taxonomy = $this->structure->taxonomy((string) config('commerce.catalog.category_taxonomy'));
        if ($taxonomy === null) {
            return [];
        }

        $items = $this->withCategories(OrderItem::query())
            ->whereIn('commerce_order_items.order_id', (clone $orders)->reorder()->select('commerce_orders.id'))
            ->where('category.taxonomy_id', $taxonomy->id)
            ->distinct()->pluck('category.id');
        if ($items->isEmpty()) {
            return [];
        }

        $terms = $taxonomy->terms()->with('translations')->whereKey($items->all())->get();
        $options = [];
        foreach ($this->structure->categoryPaths($terms) as $term => $path) {
            $labels = [];
            foreach ($path as $id => $name) {
                $labels[] = $name;
                $options[$id]['label'] = implode(' › ', $labels);
                $options[$id]['terms'][] = $term;
            }
        }

        return collect($options)->sortBy('label', SORT_NATURAL | SORT_FLAG_CASE)->all();
    }

    /**
     * @param  Builder<Order>  $orders
     * @param  list<int>  $terms
     */
    public function apply(Builder $orders, array $terms): void
    {
        $orders->whereHas('items', fn (Builder $items) => $this->withCategories($items)->whereIn('category.id', $terms));
    }

    /**
     * @param  Builder<OrderItem>  $items
     * @return Builder<OrderItem>
     */
    private function withCategories(Builder $items): Builder
    {
        return $items->leftJoin('commerce_products as ordered_product', 'ordered_product.id', '=', 'commerce_order_items.product_id')
            ->join('sunrice_entry_term as membership', 'membership.entry_id', '=', DB::raw('COALESCE(commerce_order_items.entry_id, ordered_product.entry_id)'))
            ->join('sunrice_terms as category', 'category.id', '=', 'membership.term_id');
    }
}
