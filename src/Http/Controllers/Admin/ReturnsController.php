<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Admin\Tables\Column;
use Sunrice\Commerce\Admin\Tables\TableQuery;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Returns\Actions\UpdateReturn;
use Sunrice\Commerce\Returns\Models\ReturnItem;
use Sunrice\Commerce\Returns\Models\ReturnRequest;

/** Shop → Orders → Returns: customers' return requests, approved, rejected, received and closed here. */
class ReturnsController extends Controller
{
    public function index(Request $request): Response
    {
        $this->guard();
        $table = TableQuery::for(ReturnRequest::query()->with('order'))
            ->searchUsing(fn (Builder $q, string $term) => $q->whereHas('order', fn ($o) => $o->whereLike('number', "%{$term}%")->orWhereLike('email', "%{$term}%")->orWhereLike('customer_name', "%{$term}%")))
            ->filter('status', fn (Builder $q, string $v) => $q->where('status', $v))
            ->filter('reason', fn (Builder $q, string $v) => $q->where('reason', $v))
            ->sortable(['created_at'])->apply($request);
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('id');
        }
        $rows = $table->defaultPerPage(25)->paginate($request);

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Returns',
            'description' => 'Customers\' requests to send items back. Record refunds on the order.',
            'createUrl' => null,
            ...$this->tableProps('commerce-returns', $table, [
                new Column('number', 'Return'),
                new Column('order', 'Order'),
                new Column('customer', 'Customer'),
                new Column('reason', 'Reason'),
                new Column('status', 'Status', type: 'badge'),
                new Column('created_at', 'Requested', sortable: true),
            ], $rows->through(fn (Model $r) => $r instanceof ReturnRequest ? [
                'id' => $r->id,
                'href' => "commerce/returns/{$r->id}",
                'number' => $r->number(),
                'order' => $r->order->displayNumber(),
                'customer' => $r->order->customer_name ?? $r->order->email,
                'reason' => __("commerce::account.returns.reasons.{$r->reason}", [], 'en'),
                'status' => self::label($r->status),
                'status_tone' => match ($r->status) {
                    'requested' => 'warning', 'approved', 'received' => 'info', 'closed' => 'ok', default => 'neutral'
                },
                'created_at' => $r->created_at?->isoFormat('D MMM YYYY'),
            ] : []), [
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => array_map(fn (string $s) => ['value' => $s, 'label' => self::label($s)], ReturnRequest::STATUSES)],
                ['key' => 'reason', 'label' => 'Reason', 'type' => 'select', 'options' => array_map(fn (string $s) => ['value' => $s, 'label' => __("commerce::account.returns.reasons.{$s}", [], 'en')], ReturnRequest::REASONS)],
            ]),
        ]);
    }

    public function edit(ReturnRequest $return): Response
    {
        $this->guard();
        $return->load(['order', 'items.orderItem']);
        $items = $return->items->map(fn (ReturnItem $i) => "{$i->quantity} × {$i->orderItem->title()}")->implode(', ');

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => "Return {$return->number()}",
            'description' => "Order {$return->order->displayNumber()} · ".($return->order->customer_name ?? $return->order->email).' · '.$items
                .' · '.__("commerce::account.returns.reasons.{$return->reason}", [], 'en').($return->details ? ' — '.$return->details : ''),
            'form' => SchemaForm::make([
                ['handle' => 'status', 'type' => 'select', 'label' => 'Status', 'required' => true, 'instructions' => 'A change of status is emailed to the customer with the note.',
                    'config' => ['options' => array_map(fn (string $s) => ['value' => $s, 'label' => self::label($s)], $return->allowedStatuses())]],
                ['handle' => 'note', 'type' => 'textarea', 'label' => 'Note to the customer', 'instructions' => 'Where to send the items, why it was declined…', 'validation' => ['max:2000']],
            ], ['status' => $return->status, 'note' => $return->note])->action(route('sunrice.admin.commerce.returns.update', $return, false), 'put'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Returns', 'href' => 'commerce/returns'], ['label' => $return->order->displayNumber(), 'href' => "commerce/orders/{$return->order_id}"]],
        ]);
    }

    public function update(Request $request, ReturnRequest $return, UpdateReturn $update): RedirectResponse
    {
        $this->guard();
        $data = $request->validate([
            'values.status' => ['required', Rule::in(ReturnRequest::STATUSES)],
            'values.note' => ['nullable', 'string', 'max:2000'],
        ]);
        $update->handle($return, $data['values']['status'], $data['values']['note'] ?? null, Actor::admin($request->user()));

        return back()->with('success', 'Return saved.');
    }

    protected static function label(string $status): string
    {
        return ['requested' => 'Requested', 'approved' => 'Approved', 'rejected' => 'Rejected', 'received' => 'Received', 'closed' => 'Closed'][$status] ?? $status;
    }

    protected function guard(): void
    {
        $this->authorizeFeature('returns');
        $this->authorize('commerce.returns.manage');
    }
}
