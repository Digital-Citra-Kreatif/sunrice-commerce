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
use Sunrice\Commerce\Promotions\Actions\SaveVoucher;
use Sunrice\Commerce\Promotions\Vouchers\Voucher;
use Sunrice\Commerce\Support\ActivityRecorder;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Shop → Vouchers: discount codes and automatic discounts. */
class VouchersController extends Controller
{
    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->guard();
        $query = Voucher::query()->withSum(['redemptions as discount_given' => fn ($q) => $q->whereNull('released_at')], 'amount');
        $table = TableQuery::for($query)->searchable(['code', 'name'])
            ->filter('kind', fn ($q, $v) => $q->where('automatic', $v === 'automatic'))
            ->sortable(['code', 'name', 'times_used', 'ends_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Vouchers',
            'description' => 'Discount codes and automatic discounts.',
            'createUrl' => 'commerce/vouchers/create',
            'createLabel' => 'New voucher',
            ...$this->tableProps('commerce-vouchers', $table, [
                new Column('code', 'Code', sortable: true),
                new Column('name', 'Name', sortable: true),
                new Column('discount', 'Discount'),
                new Column('times_used', 'Used', sortable: true),
                new Column('discount_given', 'Discount given'),
                new Column('ends_at', 'Ends', sortable: true),
                new Column('status', 'Status', type: 'badge'),
            ], $rows->through(fn (Model $v) => $v instanceof Voucher ? [
                'id' => $v->id,
                'href' => "commerce/vouchers/{$v->id}/edit",
                'code' => $v->code ?? 'Automatic',
                'name' => $v->name,
                'discount' => match ($v->type) {
                    'percent' => ($v->value / 100).'%'.($v->max_discount ? ' (max '.$money->format($v->max_discount).')' : ''),
                    'fixed_cart' => $money->format($v->value), 'fixed_item' => $money->format($v->value).' per item',
                    'free_shipping' => 'Free shipping'.($v->value > 0 ? ' (max '.$money->format($v->value).')' : ''),
                    default => 'Buy '.($v->bxgy['buy_qty'] ?? 1).' get '.($v->bxgy['get_qty'] ?? 1),
                },
                'times_used' => $v->times_used.($v->usage_limit ? " / {$v->usage_limit}" : ''),
                'discount_given' => $money->format((int) $v->getAttribute('discount_given')),
                'ends_at' => $v->ends_at?->isoFormat('D MMM YYYY'),
                'status' => $status = match (true) {
                    ! $v->active => 'Off', $v->starts_at?->isFuture() ?? false => 'Scheduled', $v->ends_at?->isPast() ?? false => 'Expired',
                    $v->usage_limit !== null && $v->times_used >= $v->usage_limit => 'Used up', default => 'Active',
                },
                'status_tone' => ['Active' => 'ok', 'Scheduled' => 'info', 'Used up' => 'warning'][$status] ?? 'neutral',
            ] : []), [[
                'key' => 'kind', 'label' => 'Kind', 'type' => 'select', 'options' => [['value' => 'code', 'label' => 'Codes'], ['value' => 'automatic', 'label' => 'Automatic discounts']],
            ]], []),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->guard();

        return $this->form(app(SaveVoucher::class)->blank($request->boolean('automatic')));
    }

    public function edit(Voucher $voucher): Response
    {
        $this->guard();

        return $this->form($voucher->load('targets', 'customers'));
    }

    public function store(Request $request): RedirectResponse
    {
        $this->guard();
        $voucher = $this->save(new Voucher, $request);

        return redirect()->route('sunrice.admin.commerce.vouchers.edit', $voucher)->with('success', 'Voucher created.');
    }

    public function update(Request $request, Voucher $voucher): RedirectResponse
    {
        $this->guard();
        $this->save($voucher, $request);

        return back()->with('success', 'Voucher saved.');
    }

    public function destroy(Voucher $voucher): RedirectResponse
    {
        $this->guard();
        $voucher->delete();
        app(ActivityRecorder::class)->record('deleted', 'Voucher: '.$voucher->label(), [], 'voucher');

        return redirect()->route('sunrice.admin.commerce.vouchers')->with('success', 'Voucher deleted.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('vouchers');
        $this->authorize('commerce.vouchers.manage');
    }

    /** @return array<int, array<string, mixed>> */
    protected function fields(): array
    {
        return app(SaveVoucher::class)->fields();
    }

    protected function form(Voucher $voucher): Response
    {
        $values = app(SaveVoucher::class)->values($voucher);

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => $voucher->exists ? $voucher->label() : 'New voucher',
            'description' => $voucher->exists ? "Used {$voucher->times_used} times." : null,
            'form' => SchemaForm::make($this->fields(), $values)->action(
                $voucher->exists ? route('sunrice.admin.commerce.vouchers.update', $voucher, false) : route('sunrice.admin.commerce.vouchers.store', [], false),
                $voucher->exists ? 'put' : 'post',
            ),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Vouchers', 'href' => 'commerce/vouchers']],
            'deleteUrl' => $voucher->exists ? "commerce/vouchers/{$voucher->id}" : null,
        ]);
    }

    protected function save(Voucher $voucher, Request $request): Voucher
    {
        return app(SaveVoucher::class)->handle($voucher, (array) $request->input('values', []));
    }
}
