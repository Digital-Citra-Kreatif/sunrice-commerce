<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleBoundaries;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleItem;
use Sunrice\Commerce\Promotions\FlashSales\OverlapCheck;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Support\Locales;

/** Shop → Flash sales. */
class FlashSalesController extends Controller
{
    public function index(Request $request): Response
    {
        $this->guard();
        $table = TableQuery::for(FlashSale::query()->withCount('items')->withSum('items', 'sold_quantity'))->searchable(['name'])
            ->sortable(['name', 'starts_at', 'ends_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->orderByDesc('starts_at');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Flash sales',
            'description' => 'Time-boxed sale prices with countdowns and quantity caps.',
            'createUrl' => 'commerce/flash-sales/create',
            'createLabel' => 'New flash sale',
            ...$this->tableProps('commerce-flash-sales', $table, [
                new Column('name', 'Name', sortable: true),
                new Column('starts_at', 'Starts', sortable: true),
                new Column('ends_at', 'Ends', sortable: true),
                new Column('items_count', 'Products', type: 'number'),
                new Column('sold', 'Sold', type: 'number'),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $sale) => $sale instanceof FlashSale ? [
                'id' => $sale->id,
                'href' => "commerce/flash-sales/{$sale->id}/edit",
                'name' => $sale->name,
                'starts_at' => $sale->starts_at->isoFormat('D MMM YYYY HH:mm'),
                'ends_at' => $sale->ends_at->isoFormat('D MMM YYYY HH:mm'),
                'items_count' => $sale->getAttribute('items_count'),
                'sold' => (int) $sale->getAttribute('items_sum_sold_quantity'),
                'status' => $status = match (true) {
                    ! $sale->active => 'Off', $sale->starts_at->isFuture() => 'Scheduled', $sale->ends_at->isPast() => 'Ended', default => 'Running'
                },
                'status_tone' => ['Running' => 'ok', 'Scheduled' => 'info'][$status] ?? 'neutral',
            ] : []), [], []),
        ]);
    }

    public function create(): Response
    {
        $this->guard();

        return $this->form(new FlashSale(['active' => true, 'show_countdown' => true, 'show_progress' => true, 'show_teaser' => true,
            'starts_at' => now()->addDay()->startOfHour(), 'ends_at' => now()->addDays(2)->startOfHour()]));
    }

    public function edit(FlashSale $sale): Response
    {
        $this->guard();

        return $this->form($sale->load('items'));
    }

    public function store(Request $request): RedirectResponse
    {
        $this->guard();
        $sale = $this->save(new FlashSale, $request);

        return redirect()->route('sunrice.admin.commerce.flash-sales.edit', $sale)->with('success', 'Flash sale created.');
    }

    public function update(Request $request, FlashSale $sale): RedirectResponse
    {
        $this->guard();
        $this->save($sale, $request);

        return back()->with('success', 'Flash sale saved.');
    }

    public function destroy(FlashSale $sale): RedirectResponse
    {
        $this->guard();
        $id = $sale->id;
        FlashSaleBoundaries::refresh([$id]);
        $sale->delete();
        app(ActivityRecorder::class)->record('deleted', "Flash sale: {$sale->name}", [], 'flash_sale');

        return redirect()->route('sunrice.admin.commerce.flash-sales')->with('success', 'Flash sale deleted.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('flash_sales');
        $this->authorize('commerce.flash-sales.manage');
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(): array
    {
        $descriptions = array_map(fn (string $l) => ['handle' => $l, 'type' => 'textarea', 'label' => Locales::name($l), 'translatable' => false, 'config' => ['max' => 2000]], Locales::available());

        return [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'required' => true, 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'slug', 'type' => 'text', 'label' => 'URL slug', 'translatable' => false, 'instructions' => 'Its page: /flash-sale/{slug}. Empty: from the name.', 'validation' => ['regex:/^[a-z0-9-]*$/', 'max:120']],
            ['handle' => 'active', 'type' => 'toggle', 'label' => 'Active'],
            ['handle' => 'dates', 'type' => 'commerce_datetime_range', 'label' => 'When', 'required' => true, 'config' => ['require_start' => true, 'require_end' => true]],
            ['handle' => 'badge', 'type' => 'text', 'label' => 'Badge', 'translatable' => false, 'instructions' => 'e.g. "12.12"', 'config' => ['max' => 40]],
            ['handle' => 'description', 'type' => 'group', 'label' => 'Description', 'config' => ['fields' => $descriptions]],
            ['handle' => 'banner', 'type' => 'asset', 'label' => 'Banner', 'config' => ['image_only' => true]],
            ['handle' => 'show_countdown', 'type' => 'toggle', 'label' => 'Show a countdown'],
            ['handle' => 'show_progress', 'type' => 'toggle', 'label' => 'Show how much is sold (items with a cap)'],
            ['handle' => 'show_teaser', 'type' => 'toggle', 'label' => 'Announce it before it starts'],
            ['handle' => 'per_customer_limit', 'type' => 'number', 'label' => 'Units per customer', 'instructions' => 'At the sale price, per item. Empty: no limit.', 'config' => ['min' => 1], 'validation' => ['integer']],
            ['handle' => 'items', 'type' => 'repeater', 'label' => 'Products', 'required' => true, 'config' => ['min' => 1, 'max' => 200, 'fields' => [
                ['handle' => 'target', 'type' => 'commerce_targets', 'label' => 'Product or variant', 'required' => true, 'config' => ['types' => ['product', 'variant']]],
                ['handle' => 'discount_type', 'type' => 'select', 'label' => 'Sale price', 'required' => true, 'config' => ['options' => [
                    ['value' => 'percent_off', 'label' => 'Percent off'], ['value' => 'amount_off', 'label' => 'Amount off'], ['value' => 'fixed_price', 'label' => 'Fixed price'],
                ]]],
                ['handle' => 'percent', 'type' => 'number', 'label' => 'Percent', 'config' => ['min' => 0, 'max' => 100]],
                ['handle' => 'amount', 'type' => 'commerce_money', 'label' => 'Amount or price'],
                ['handle' => 'quantity_limit', 'type' => 'number', 'label' => 'Units at this price (cap)', 'config' => ['min' => 1], 'validation' => ['integer']],
                ['handle' => 'per_customer_limit', 'type' => 'number', 'label' => 'Units per customer', 'config' => ['min' => 1], 'validation' => ['integer']],
            ]]],
        ];
    }

    protected function form(FlashSale $sale): Response
    {
        $items = $sale->exists ? $sale->items : collect();
        $targets = TargetLabels::for($items->map(fn (FlashSaleItem $i) => $i->variant_id !== null ? ['type' => 'variant', 'id' => $i->variant_id] : ['type' => 'product', 'id' => $i->product_id])->all());
        $values = [
            'name' => $sale->name, 'slug' => $sale->slug, 'active' => $sale->active, 'badge' => $sale->badge, 'description' => $sale->description ?? [],
            'banner' => $sale->banner_asset_id, 'show_countdown' => $sale->show_countdown, 'show_progress' => $sale->show_progress, 'show_teaser' => $sale->show_teaser,
            'per_customer_limit' => $sale->per_customer_limit,
            'dates' => ['start' => $sale->starts_at?->toIso8601String(), 'end' => $sale->ends_at?->toIso8601String()],
            'items' => $items->values()->map(fn (FlashSaleItem $i, int $n) => [
                'target' => [$targets[$n]], 'discount_type' => $i->discount_type,
                'percent' => $i->discount_type === 'percent_off' ? $i->discount_value / 100 : null,
                'amount' => $i->discount_type !== 'percent_off' ? $i->discount_value : null,
                'quantity_limit' => $i->quantity_limit, 'per_customer_limit' => $i->per_customer_limit,
            ])->all(),
        ];
        $form = SchemaForm::make($this->fields(), $values)->action(
            $sale->exists ? route('sunrice.admin.commerce.flash-sales.update', $sale, false) : route('sunrice.admin.commerce.flash-sales.store', [], false),
            $sale->exists ? 'put' : 'post',
        );

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $sale->exists ? $sale->name : 'New flash sale',
            'description' => $sale->exists ? 'Sold so far: '.$items->sum('sold_quantity').' units.' : null,
            'form' => $form,
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Flash sales', 'href' => 'commerce/flash-sales']],
            'deleteUrl' => $sale->exists ? "commerce/flash-sales/{$sale->id}" : null,
        ]);
    }

    protected function save(FlashSale $sale, Request $request): FlashSale
    {
        $values = SchemaForm::make($this->fields())->validate((array) $request->input('values', []), [
            'slug' => [Rule::unique('commerce_flash_sales', 'slug')->ignore($sale->id)],
        ]);
        $items = [];
        foreach ((array) $values['items'] as $i => $item) {
            $target = $item['target'][0] ?? null;
            if ($target === null) {
                throw SchemaForm::prefixed(ValidationException::withMessages(["items.{$i}.target" => 'Choose a product or variant.']));
            }
            $variant = $target['type'] === 'variant' ? Variant::query()->find($target['id']) : null;
            $type = (string) $item['discount_type'];
            $value = $type === 'percent_off' ? (int) round((float) ($item['percent'] ?? 0) * 100) : (int) ($item['amount'] ?? 0);
            if ($type === 'percent_off' && ($value <= 0 || $value > 10000)) {
                throw SchemaForm::prefixed(ValidationException::withMessages(["items.{$i}.percent" => 'Enter a percentage between 0 and 100.']));
            }
            $items[] = [
                'product_id' => $variant?->product_id ?? (int) $target['id'], 'variant_id' => $variant?->id,
                'discount_type' => $type, 'discount_value' => $value,
                'quantity_limit' => $item['quantity_limit'] ?? null, 'per_customer_limit' => $item['per_customer_limit'] ?? null, 'position' => $i,
            ];
        }
        $starts = Carbon::parse($values['dates']['start']);
        $ends = Carbon::parse($values['dates']['end']);
        if ((bool) $values['active'] && ($other = OverlapCheck::conflict($items, $starts, $ends, $sale->id)) !== null) {
            throw SchemaForm::prefixed(ValidationException::withMessages(['items' => "Some of these products are in \"{$other}\" at the same time. A product can be in one flash sale at a time."]));
        }

        $before = $sale->exists ? [$sale->id] : [];
        DB::transaction(function () use ($sale, $values, $items, $starts, $ends): void {
            $sale->fill([
                'name' => $values['name'], 'slug' => $values['slug'] ?: Str::slug($values['name']).($sale->exists ? '' : '-'.Str::lower(Str::random(4))),
                'active' => (bool) $values['active'], 'starts_at' => $starts, 'ends_at' => $ends, 'badge' => $values['badge'],
                'description' => array_filter((array) $values['description']), 'banner_asset_id' => $values['banner'] ?? null,
                'show_countdown' => (bool) $values['show_countdown'], 'show_progress' => (bool) $values['show_progress'], 'show_teaser' => (bool) $values['show_teaser'],
                'per_customer_limit' => $values['per_customer_limit'] ?? null,
            ])->save();
            // Keep sold counts of items that stay.
            $existing = $sale->items()->get()->keyBy(fn (FlashSaleItem $i) => $i->product_id.':'.$i->variant_id);
            $kept = [];
            foreach ($items as $item) {
                $row = $existing->get($item['product_id'].':'.$item['variant_id']) ?? new FlashSaleItem(['flash_sale_id' => $sale->id]);
                $row->fill($item)->save();
                $kept[] = $row->id;
            }
            $sale->items()->whereNotIn('id', $kept)->delete();
        });
        FlashSaleBoundaries::refresh([...$before, $sale->id]);
        app(ActivityRecorder::class)->record($sale->wasRecentlyCreated ? 'created' : 'updated', "Flash sale: {$sale->name}", [], 'flash_sale');

        return $sale;
    }
}
