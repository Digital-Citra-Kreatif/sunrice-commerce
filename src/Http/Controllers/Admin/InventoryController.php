<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Catalog\Models\StockMovement;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Inventory\Actions\AdjustStock;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Support\Locales;

/** Shop → Inventory: stock of every variant, adjustments and their history. */
class InventoryController extends Controller
{
    public function index(Request $request, StoreSettings $settings): Response
    {
        $this->authorizeFeature('inventory');
        $this->authorize('commerce.inventory.view');
        $threshold = (int) $settings->get('catalog.low_stock_threshold', 5);

        $query = Variant::query()
            ->select('commerce_variants.*', 't.title as product_title', 'commerce_products.entry_id', 'commerce_products.collection_id')
            ->join('commerce_products', 'commerce_products.id', '=', 'commerce_variants.product_id')
            ->leftJoin('sunrice_entry_translations as t', fn ($j) => $j->on('t.entry_id', '=', 'commerce_products.entry_id')->where('t.locale', Locales::main()))
            ->whereNull('commerce_products.removed_at')
            ->where('commerce_products.type', '!=', 'bundle');

        $table = TableQuery::for($query)
            ->searchable(['t.title', 'commerce_variants.sku', 'commerce_variants.title'])
            ->filter('stock', fn (Builder $q, mixed $value) => match ($value) {
                'out' => $q->where('commerce_variants.track_stock', true)->where('commerce_variants.stock_quantity', '<=', 0),
                'low' => $q->where('commerce_variants.track_stock', true)->where('commerce_variants.stock_quantity', '>', 0)
                    ->whereRaw('commerce_variants.stock_quantity <= COALESCE(commerce_variants.low_stock_threshold, ?)', [$threshold]),
                'untracked' => $q->where('commerce_variants.track_stock', false),
                default => $q,
            })
            ->sortable(['stock_quantity', 'sku', 'product_title'])
            ->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderBy('t.title')->orderBy('commerce_variants.position');
        }
        $rows = $table->defaultPerPage(50)->paginate($request);

        return Inertia::render('Commerce/Inventory/Index', [
            ...$this->tableProps('commerce-inventory', $table, [
                new Column('product_title', 'Product', sortable: true),
                new Column('sku', 'SKU', sortable: true),
                new Column('stock_quantity', 'Stock', sortable: true, type: 'number'),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $v) => $v instanceof Variant ? [
                'id' => $v->id,
                'product_title' => trim($v->getAttribute('product_title').($v->title !== '' ? ' — '.$v->title : '')),
                'entry_id' => $v->getAttribute('entry_id'),
                'sku' => $v->sku,
                'track_stock' => $v->track_stock,
                'stock_quantity' => $v->stock_quantity,
                'backorders' => $v->backorders,
                'status' => $v->computedStockStatus(),
                'low' => $v->track_stock && (int) $v->stock_quantity > 0 && (int) $v->stock_quantity <= ($v->low_stock_threshold ?? $threshold),
            ] : throw new \LogicException('Expected a variant.')), [[
                'key' => 'stock', 'label' => 'Stock', 'type' => 'select', 'options' => [
                    ['value' => 'low', 'label' => 'Low stock'], ['value' => 'out', 'label' => 'Out of stock'], ['value' => 'untracked', 'label' => 'Not tracked'],
                ],
            ]]),
            'can' => ['adjust' => $request->user()->can('commerce.inventory.adjust')],
            'reasons' => AdjustStock::REASONS,
        ]);
    }

    public function adjust(Request $request, Variant $variant, AdjustStock $adjust): RedirectResponse
    {
        $this->authorizeFeature('inventory');
        $this->authorize('commerce.inventory.adjust');
        $data = $request->validate([
            'mode' => ['required', Rule::in(['add', 'set'])],
            'quantity' => ['required', 'integer', 'between:-1000000,1000000'],
            'reason' => ['required', Rule::in(AdjustStock::REASONS)],
            'note' => ['nullable', 'string', 'max:255'],
        ]);
        $variant = $adjust->handle($variant, (int) $data['quantity'], $data['mode'] === 'set', $data['reason'], $data['note'] ?? null, (int) $request->user()->getAuthIdentifier());

        return back()->with('success', 'Stock is now '.$variant->stock_quantity.'.');
    }

    public function history(Variant $variant): JsonResponse
    {
        $this->authorizeFeature('inventory');
        $this->authorize('commerce.inventory.view');
        $users = config('sunrice.auth.user_model');
        $movements = StockMovement::query()->where('variant_id', $variant->id)->latest('id')->limit(100)->get();
        $names = $movements->pluck('user_id')->filter()->unique()->isEmpty() ? collect() : $users::query()->whereIn('id', $movements->pluck('user_id')->filter())->pluck('name', 'id');

        return response()->json(['data' => $movements->map(fn (StockMovement $m) => [
            'id' => $m->id, 'delta' => $m->delta, 'quantity_after' => $m->quantity_after, 'reason' => $m->reason,
            'note' => $m->note, 'user' => $names[$m->user_id] ?? null, 'at' => $m->created_at?->toIso8601String(),
            'reference' => $m->reference_type ? ['type' => class_basename($m->reference_type), 'id' => $m->reference_id] : null,
        ])]);
    }
}
