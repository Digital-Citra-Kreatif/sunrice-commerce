<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Support\Locales;

#[IsReadOnly]
#[Description('List products with their commerce data: entry id (for get_product and update_entry), title, type, price or price range, stock and publication status. Search by title or SKU; filter by stock (in, out, low) or featured.')]
class ListProductsTool extends ProductTool
{
    protected string $name = 'list_products';

    protected function run(Request $request): Response
    {
        $args = $request->validate(['search' => ['nullable', 'string', 'max:120'], 'stock' => ['nullable', 'in:in,out,low'], 'featured' => ['nullable', 'boolean'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100']]);
        $query = DB::table('commerce_products as p')->join('sunrice_entries as e', 'e.id', '=', 'p.entry_id')
            ->leftJoin('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'e.id')->where('t.locale', Locales::main()))
            ->whereIn('e.collection_id', $this->collections()->pluck('id'))->whereNull('e.deleted_at')->whereNull('p.removed_at');
        if (! empty($args['search'])) {
            $like = '%'.$args['search'].'%';
            $query->where(fn (Builder $q) => $q->whereLike('t.title', $like)
                ->orWhereExists(fn (Builder $v) => $v->from('commerce_variants')->whereColumn('commerce_variants.product_id', 'p.id')->whereLike('commerce_variants.sku', $like)));
        }
        match ($args['stock'] ?? null) {
            'in' => $query->where('p.in_stock', true),
            'out' => $query->where('p.in_stock', false),
            'low' => $query->whereExists(fn (Builder $v) => $v->from('commerce_variants')->whereColumn('commerce_variants.product_id', 'p.id')
                ->where('track_stock', true)->where('stock_quantity', '>', 0)->whereRaw('stock_quantity <= COALESCE(low_stock_threshold, 5)')),
            default => null,
        };
        if (isset($args['featured'])) {
            $query->where('p.featured', (bool) $args['featured']);
        }
        $total = (clone $query)->count();
        $rows = $query->orderBy('t.title')->limit((int) ($args['limit'] ?? 25))
            ->get(['e.id as entry_id', 'p.id as product_id', 't.title', 'p.type', 'p.min_price', 'p.max_price', 'p.in_stock', 'p.featured', 'e.status']);

        return $this->json(['total' => $total, 'products' => $rows->map(fn (object $r) => [
            'id' => (int) $r->entry_id, 'product_id' => (int) $r->product_id, 'title' => $r->title, 'type' => $r->type, 'status' => $r->status,
            'price' => $r->min_price === null ? null : OrderData::money((int) $r->min_price),
            'max_price' => $r->max_price !== null && $r->max_price !== $r->min_price ? OrderData::money((int) $r->max_price) : null,
            'in_stock' => (bool) $r->in_stock, 'featured' => (bool) $r->featured,
        ])->all()]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->description('Title or SKU.'),
            'stock' => $schema->string()->enum(['in', 'out', 'low']),
            'featured' => $schema->boolean(),
            'limit' => $schema->integer()->description('Default 25, at most 100.'),
        ];
    }
}
