<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Promotions\Actions\SaveFlashSale;
use Sunrice\Commerce\Promotions\FlashSales\FlashSale;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleBoundaries;
use Sunrice\Commerce\Support\ActivityRecorder;

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

        return $this->form(app(SaveFlashSale::class)->blank());
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
        return app(SaveFlashSale::class)->fields();
    }

    protected function form(FlashSale $sale): Response
    {
        $values = app(SaveFlashSale::class)->values($sale);
        $form = SchemaForm::make($this->fields(), $values)->action(
            $sale->exists ? route('sunrice.admin.commerce.flash-sales.update', $sale, false) : route('sunrice.admin.commerce.flash-sales.store', [], false),
            $sale->exists ? 'put' : 'post',
        );

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $sale->exists ? $sale->name : 'New flash sale',
            'description' => $sale->exists ? 'Sold so far: '.$sale->items->sum('sold_quantity').' units.' : null,
            'form' => $form,
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Flash sales', 'href' => 'commerce/flash-sales']],
            'deleteUrl' => $sale->exists ? "commerce/flash-sales/{$sale->id}" : null,
        ]);
    }

    protected function save(FlashSale $sale, Request $request): FlashSale
    {
        return app(SaveFlashSale::class)->handle($sale, (array) $request->input('values', []));
    }
}
