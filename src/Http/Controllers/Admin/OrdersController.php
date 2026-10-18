<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;
use Sunrice\Admin\Table\Column;
use Sunrice\Admin\Table\TableQuery;
use Sunrice\Commerce\Admin\SchemaForm;
use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Digital\Models\DownloadGrant;
use Sunrice\Commerce\Documents\Documents;
use Sunrice\Commerce\Orders\Actions\AddOrderNote;
use Sunrice\Commerce\Orders\Actions\CreateManualOrder;
use Sunrice\Commerce\Orders\Actions\CreateShipment;
use Sunrice\Commerce\Orders\Actions\EditOrder;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\RecordRefund;
use Sunrice\Commerce\Orders\Actions\RespondToQuote;
use Sunrice\Commerce\Orders\Actions\StaffPricing;
use Sunrice\Commerce\Orders\Actions\TrashOrder;
use Sunrice\Commerce\Orders\Actions\UpdateOrderAddresses;
use Sunrice\Commerce\Orders\Actions\UpdateShipment;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\PaymentLinkRequested;
use Sunrice\Commerce\Orders\InvalidTransition;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderEvent;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Orders\OrderPanels;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentManager;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Commerce\Shipping\Couriers;
use Sunrice\Commerce\Support\Address;
use Sunrice\Commerce\Support\DomainException;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Http\Controllers\Admin\TablePreferencesController;
use Sunrice\Support\CsvCell;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Shop → Orders: the list (search, filters, columns, bulk actions, export) and the order page. */
class OrdersController extends Controller
{
    public const TABLE = 'commerce-orders';

    public function index(Request $request, MoneyFormatter $money): Response
    {
        $this->guard();
        $table = $this->table($request);
        // The items column: summed in the page query rather than once per row.
        $table->builder()->withSum(['items as items_quantity' => fn (Builder $q) => $q->whereNull('parent_id')], 'quantity');
        $rows = $table->defaultPerPage(TablePreferencesController::perPageFor($request, self::TABLE, 25))->paginate($request);
        $columns = $this->columns();

        return Inertia::render('Commerce/Shared/ResourceIndex', [
            'title' => 'Orders',
            'description' => 'Orders and quote requests.',
            'createUrl' => $request->user()->can('commerce.orders.create') ? 'commerce/orders/create' : null,
            'createLabel' => 'New order',
            ...$this->tableProps(self::TABLE, $table, $columns, $rows->through(fn (Model $o) => $o instanceof Order ? $this->row($o, $money) : []),
                $this->filters(), $this->bulkActions($request)),
            'visibleColumns' => TablePreferencesController::columnsFor((int) $request->user()->getAuthIdentifier(), self::TABLE,
                ['number', 'date', 'customer', 'status', 'payment', 'fulfillment', 'total']),
            'bulkUrl' => route('sunrice.admin.commerce.orders.bulk', [], false),
            'exportUrl' => $request->user()->can('commerce.orders.export') ? route('sunrice.admin.commerce.orders.export', [], false) : null,
            'searchPlaceholder' => 'Number, name, email, phone or SKU…',
        ]);
    }

    /** CSV of the filtered list (spatie/simple-excel). */
    public function export(Request $request, MoneyFormatter $money): StreamedResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.export');
        $query = $this->table($request)->builder();

        return response()->streamDownload(function () use ($query): void {
            $writer = SimpleExcelWriter::streamDownload('orders.csv');
            $query->with('items')->chunk(500, function ($orders) use ($writer): void {
                foreach ($orders as $order) {
                    if ($order instanceof Order) {
                        // Customer-typed text (names, addresses) must not run as a spreadsheet formula.
                        $writer->addRow(array_map(CsvCell::safe(...), $this->exportRow($order)));
                    }
                }
            });
            $writer->close();
        }, 'orders-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv']);
    }

    /** @return array<string, string|int|null> */
    public function exportRow(Order $order): array
    {
        return [
            'number' => $order->displayNumber(),
            'type' => $order->type,
            'date' => $order->placed_at?->toDateTimeString(),
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'fulfillment_status' => $order->fulfillment_status,
            'customer' => $order->customer_name,
            'email' => $order->email,
            'phone' => $order->phone,
            'items' => $order->items->whereNull('parent_id')->map(fn (OrderItem $i) => $i->quantity.' × '.($i->sku ?? $i->title()))->implode('; '),
            'subtotal' => $order->subtotal,
            'discount' => $order->discount_total,
            'shipping' => $order->shipping_total,
            'fees' => $order->fee_total,
            'tax' => $order->tax_total,
            'total' => $order->total,
            'paid' => $order->paid_total,
            'refunded' => $order->refunded_total,
            'payment_method' => $order->payment_method,
            'shipping_method' => $order->shipping_method['label'] ?? null,
            'city' => $order->shipping_address['city'] ?? null,
            'province' => $order->shipping_address['province'] ?? null,
            'channel' => $order->channel,
            'currency' => $order->currency,
        ];
    }

    public function bulk(Request $request, OrderStateMachine $states): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        $this->guard();
        $data = $request->validate([
            'action' => ['required', Rule::in(['processing', 'completed', 'trash', 'packing_slips'])],
            'ids' => ['required', 'array', 'max:200'],
            'ids.*' => ['integer'],
        ]);
        if ($data['action'] === 'packing_slips') {
            return Inertia::location(route('sunrice.admin.commerce.orders.packing-slips', ['ids' => implode(',', $data['ids'])]));
        }
        $this->authorize($data['action'] === 'trash' ? 'commerce.orders.delete' : 'commerce.orders.edit');
        $done = 0;
        $skipped = 0;
        foreach (Order::query()->whereIn('id', $data['ids'])->get() as $order) {
            if ($data['action'] === 'trash') {
                app(TrashOrder::class)->trash($order);
                $done++;

                continue;
            }
            if ($states->can($order, $data['action'])) {
                $states->transition($order, $data['action'], Actor::admin($request->user()));
                $done++;
            } else {
                $skipped++;
            }
        }

        return back()->with('success', trim(($done === 1 ? '1 order updated.' : "{$done} orders updated.").($skipped > 0 ? " {$skipped} skipped (not allowed from their status)." : '')));
    }

    public function create(Request $request): Response
    {
        $this->guard();
        $this->authorize('commerce.orders.create');

        return Inertia::render('Commerce/Orders/Editor', [
            'mode' => 'create',
            'order' => null,
            'paymentMethods' => $this->paymentMethodOptions(),
            'canOverride' => $request->user()->can('commerce.orders.override-prices'),
            'variantsUrl' => route('sunrice.admin.commerce.api.variants', ['bundles' => 1], false),
            'previewUrl' => route('sunrice.admin.commerce.orders.preview', [], false),
            'submitUrl' => route('sunrice.admin.commerce.orders.store', [], false),
        ]);
    }

    public function store(Request $request, CreateManualOrder $create): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.create');
        $order = $create->handle($request->all(), Actor::admin($request->user()), $request->user());

        return redirect()->route('sunrice.admin.commerce.orders.show', $order)->with('success', "Order {$order->displayNumber()} created.");
    }

    public function edit(Request $request, Order $order, EditOrder $edit, MoneyFormatter $money): Response|RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.edit');
        if (! $edit->editable($order)) {
            return redirect()->route('sunrice.admin.commerce.orders.show', $order)->with('error', 'Only unpaid orders that haven\'t shipped can be edited.');
        }
        $discount = (int) -$order->adjustments()->where('kind', 'discount')->sum('amount');

        return Inertia::render('Commerce/Orders/Editor', [
            'mode' => 'edit',
            'order' => [
                'id' => $order->id, 'number' => $order->displayNumber(), 'customer' => $order->customer_name ?? $order->email,
                'lines' => $order->items()->whereNull('parent_id')->get()->map(fn (OrderItem $i) => [
                    'item_id' => $i->id, 'variant_id' => $i->variant_id, 'label' => $i->title(), 'sku' => $i->sku, 'quantity' => $i->quantity,
                    'price' => $i->unit_price, 'unit_price' => null,
                ])->all(),
                'shipping' => $order->shipping_method !== null ? ['label' => $order->shipping_method['label'] ?? '', 'cost' => $order->shipping_total] : null,
                'discount' => $discount > 0 ? ['label' => '', 'amount' => $discount] : null,
                'needs_shipping' => $order->needsShipping(),
            ],
            'paymentMethods' => [],
            'canOverride' => $request->user()->can('commerce.orders.override-prices'),
            'variantsUrl' => route('sunrice.admin.commerce.api.variants', ['bundles' => 1], false),
            'previewUrl' => route('sunrice.admin.commerce.orders.preview', ['order' => $order->id], false),
            'submitUrl' => route('sunrice.admin.commerce.orders.update', $order, false),
        ]);
    }

    public function update(Request $request, Order $order, EditOrder $edit): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.edit');
        $data = $request->validate([
            'lines' => ['required', 'array', 'min:1', 'max:200'], 'lines.*.item_id' => ['nullable', 'integer'], 'lines.*.variant_id' => ['required', 'integer'],
            'lines.*.quantity' => ['required', 'integer', 'min:1'], 'lines.*.unit_price' => ['nullable', 'integer', 'min:0'],
            'shipping.label' => ['nullable', 'string', 'max:120'], 'shipping.cost' => ['nullable', 'integer', 'min:0'],
            'discount.label' => ['nullable', 'string', 'max:120'], 'discount.amount' => ['nullable', 'integer', 'min:0'], 'notify' => ['boolean'],
        ]);
        $edit->handle($order, $data['lines'], isset($data['shipping']) ? ['label' => (string) ($data['shipping']['label'] ?? ''), 'cost' => (int) ($data['shipping']['cost'] ?? 0)] : null,
            isset($data['discount']) ? ['label' => (string) ($data['discount']['label'] ?? ''), 'amount' => (int) ($data['discount']['amount'] ?? 0)] : null,
            Actor::admin($request->user()), $request->user(), (bool) ($data['notify'] ?? false));

        return redirect()->route('sunrice.admin.commerce.orders.show', $order)->with('success', 'Order saved.');
    }

    public function editQuote(Request $request, Order $order): Response|RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.quotes.respond');
        if (! $order->isQuote() || ! in_array($order->status, [OrderStatus::REQUESTED, OrderStatus::QUOTED], true)) {
            return redirect()->route('sunrice.admin.commerce.orders.show', $order)->with('error', 'Only open quote requests can be priced.');
        }
        $discount = (int) -$order->adjustments()->where('kind', 'discount')->sum('amount');

        return Inertia::render('Commerce/Orders/Editor', [
            'mode' => 'quote',
            'order' => [
                'id' => $order->id, 'number' => $order->displayNumber(), 'customer' => $order->customer_name ?? $order->email,
                'lines' => $order->items()->whereNull('parent_id')->get()->map(fn (OrderItem $i) => [
                    'item_id' => $i->id, 'variant_id' => $i->variant_id, 'label' => $i->title(), 'sku' => $i->sku, 'quantity' => $i->quantity,
                    'price' => $i->unit_price, 'unit_price' => $i->unit_price,
                ])->all(),
                'shipping' => $order->shipping_method !== null ? ['label' => $order->shipping_method['label'] ?? '', 'cost' => $order->shipping_total] : null,
                'discount' => $discount > 0 ? ['label' => '', 'amount' => $discount] : null,
                'needs_shipping' => $order->needsShipping(),
                'valid_until' => ($order->quote_valid_until ?? now()->addDays((int) app(StoreSettings::class)->get('checkout.quote_valid_days', 14)))->toDateString(),
            ],
            'paymentMethods' => [],
            'canOverride' => true,
            'variantsUrl' => route('sunrice.admin.commerce.api.variants', ['bundles' => 1], false),
            'previewUrl' => route('sunrice.admin.commerce.orders.preview', ['order' => $order->id, 'quote' => 1], false),
            'submitUrl' => route('sunrice.admin.commerce.orders.quote.update', $order, false),
        ]);
    }

    public function updateQuote(Request $request, Order $order, RespondToQuote $respond): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.quotes.respond');
        $data = $request->validate([
            'lines' => ['required', 'array', 'min:1', 'max:200'], 'lines.*.item_id' => ['nullable', 'integer'], 'lines.*.variant_id' => ['required', 'integer'],
            'lines.*.quantity' => ['required', 'integer', 'min:1'], 'lines.*.unit_price' => ['nullable', 'integer', 'min:0'],
            'shipping.label' => ['nullable', 'string', 'max:120'], 'shipping.cost' => ['nullable', 'integer', 'min:0'],
            'discount.label' => ['nullable', 'string', 'max:120'], 'discount.amount' => ['nullable', 'integer', 'min:0'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:today'], 'send' => ['boolean'],
        ]);
        $respond->handle($order, $data['lines'],
            ! empty($data['shipping']['label']) ? ['label' => (string) $data['shipping']['label'], 'cost' => (int) ($data['shipping']['cost'] ?? 0)] : null,
            ($data['discount']['amount'] ?? 0) > 0 ? ['label' => (string) ($data['discount']['label'] ?? ''), 'amount' => (int) $data['discount']['amount']] : null,
            isset($data['valid_until']) ? Carbon::parse($data['valid_until'])->endOfDay() : null,
            Actor::admin($request->user()), $request->user(), (bool) ($data['send'] ?? true));

        return redirect()->route('sunrice.admin.commerce.orders.show', $order)->with('success', ($data['send'] ?? true) ? 'Quote sent to the customer.' : 'Quote saved.');
    }

    /** JSON: the totals the editor's lines would give. */
    public function preview(Request $request, StaffPricing $pricing, MoneyFormatter $money): JsonResponse
    {
        $this->guard();
        $order = $request->filled('order') ? Order::query()->find($request->integer('order')) : null;
        $lines = array_values(array_filter((array) $request->input('lines', []), fn ($l) => is_array($l) && isset($l['variant_id'])));
        if ($order !== null) {
            $items = $order->items()->whereNull('parent_id')->get()->keyBy('id');
            foreach ($lines as &$line) {
                $item = isset($line['item_id']) ? $items->get((int) $line['item_id']) : null;
                if ($item !== null && ($line['unit_price'] ?? null) === null) {
                    $line['frozen'] = $item->unit_price;
                }
            }
            unset($line);
        }
        $shipping = $request->input('shipping');
        $discount = $request->input('discount');
        try {
            $state = $pricing->calculate($lines, $order?->customer?->user(), ($order !== null ? $order->shipping_address : null) ?? ((array) $request->input('shipping_address') ?: null), array_filter([
                'shipping' => is_array($shipping) && ($shipping['label'] ?? '') !== '' ? ['label' => (string) $shipping['label'], 'cost' => (int) ($shipping['cost'] ?? 0)] : null,
                'discount' => is_array($discount) && (int) ($discount['amount'] ?? 0) > 0 ? ['label' => (string) ($discount['label'] ?? ''), 'amount' => (int) $discount['amount']] : null,
            ]), $request->user(), channel: $request->boolean('quote') ? 'quote' : 'admin', pricesAllowed: $request->boolean('quote') && $request->user()->can('commerce.quotes.respond'));
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json([
            'lines' => array_map(fn ($l) => ['variant_id' => $l->variant->id, 'unit_price' => $l->unitPrice, 'unit_price_formatted' => $money->format($l->unitPrice), 'total' => $money->format($l->net())], array_values($state->lines)),
            'totals' => array_map(fn (int $a) => $money->format($a), $state->totals),
            'needs_shipping' => $state->shipping['needed'],
            'notices' => array_column($state->notices, 'message'),
        ]);
    }

    public function sendLink(Request $request, Order $order): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.edit');
        abort_unless($order->isUnpaid() && ! $order->isQuote(), 422);
        PaymentLinkRequested::dispatch($order);
        app(Timeline::class)->record($order, 'email', 'Payment link sent', [], Actor::admin($request->user()), 'customer');

        return back()->with('success', 'Payment link sent to the customer.');
    }

    /** @return array<int, array{value: string, label: string}> */
    protected function paymentMethodOptions(): array
    {
        $out = [];
        foreach (app(PaymentManager::class)->all() as $key => $method) {
            $out[] = ['value' => $key, 'label' => PaymentManager::titleOf($method)];
        }

        return $out;
    }

    public function show(Request $request, Order $order, MoneyFormatter $money, OrderStateMachine $states, Couriers $couriers): Response
    {
        $this->guard();
        $order->load(['items.children', 'adjustments', 'events', 'payments', 'confirmations', 'shipments', 'refunds', 'documents', 'customer']);
        $user = $request->user();
        $statuses = $order->isQuote() ? OrderStatus::QUOTE_STATUSES : OrderStatus::ORDER_STATUSES;
        $f = fn (int $amount) => $money->format($amount);

        return Inertia::render('Commerce/Orders/Show', [
            'order' => [
                'id' => $order->id, 'type' => $order->type, 'number' => $order->displayNumber(), 'order_key' => $order->order_key,
                'status' => $order->status, 'status_label' => OrderStatus::label($order->status),
                'payment_status' => $order->payment_status, 'payment_label' => OrderStatus::label($order->payment_status, 'payment'),
                'fulfillment_status' => $order->fulfillment_status, 'fulfillment_label' => OrderStatus::label($order->fulfillment_status, 'fulfillment'),
                'channel' => $order->channel, 'selling_mode' => $order->selling_mode, 'locale' => $order->locale,
                'placed_at' => $order->placed_at?->toIso8601String(), 'expires_at' => $order->expires_at?->toIso8601String(),
                'paid_at' => $order->paid_at?->toIso8601String(), 'completed_at' => $order->completed_at?->toIso8601String(),
                'cancelled_at' => $order->cancelled_at?->toIso8601String(), 'cancel_reason' => $order->cancel_reason,
                'quote_valid_until' => $order->quote_valid_until?->toIso8601String(),
                'trashed' => $order->trashed(),
                'customer' => [
                    'name' => $order->customer_name, 'email' => $order->email, 'phone' => $order->phone,
                    'href' => $order->customer_id !== null && $user->can('commerce.customers.view') ? "commerce/customers/{$order->customer_id}" : null,
                    'guest' => $order->user_id === null,
                ],
                'shipping_address' => $order->shipping_address, 'billing_address' => $order->billing_address,
                'shipping_address_text' => $order->shipping_address ? Address::fromArray($order->shipping_address)->format() : null,
                'billing_address_text' => $order->billing_address ? Address::fromArray($order->billing_address)->format() : null,
                'shipping_method' => $order->shipping_method, 'pickup' => $order->meta('pickup'),
                'payment_method_title' => $order->payment_method_title,
                'customer_note' => $order->customer_note, 'dropship' => $order->dropship, 'fields' => $order->fields,
                'items' => $order->items->whereNull('parent_id')->values()->map(fn (OrderItem $i) => [
                    'id' => $i->id, 'name' => $i->name, 'variant_title' => $i->variant_title, 'sku' => $i->sku, 'options' => $i->options,
                    'quantity' => $i->quantity, 'fulfilled_quantity' => $i->fulfilled_quantity, 'refunded_quantity' => $i->refunded_quantity,
                    'unfulfilled' => $i->unfulfilled(), 'requires_shipping' => $i->requires_shipping,
                    'unit_price' => $i->unit_price, 'unit_price_formatted' => $f($i->unit_price),
                    'regular_unit_price' => $i->regular_unit_price > $i->unit_price ? $f($i->regular_unit_price) : null,
                    'price_source' => $this->priceSource($i), 'subtotal' => $f($i->subtotal),
                    'discount' => $i->discount_total > 0 ? $f($i->discount_total) : null, 'total' => $f($i->total),
                    'product_href' => $i->entry_id !== null ? "collections/products/entries/{$i->entry_id}" : null,
                    'components' => $i->children->map(fn (OrderItem $c) => ['name' => $c->title(), 'sku' => $c->sku, 'quantity' => $c->quantity])->values()->all(),
                ])->all(),
                'totals' => [
                    'subtotal' => $f($order->subtotal), 'discount' => $order->discount_total > 0 ? $f($order->discount_total) : null,
                    'shipping' => $order->needsShipping() ? $f($order->shipping_total) : null, 'fees' => $order->fee_total > 0 ? $f($order->fee_total) : null,
                    'tax' => $order->tax_total > 0 ? $f($order->tax_total) : null, 'tax_included' => $order->prices_include_tax,
                    'total' => $f($order->total), 'total_amount' => $order->total, 'paid' => $f($order->paid_total), 'refunded' => $order->refunded_total > 0 ? $f($order->refunded_total) : null,
                    'refundable' => max(0, $order->paid_total - $order->refunded_total),
                ],
                'adjustments' => $order->adjustments->map(fn ($a) => ['kind' => $a->kind, 'label' => $a->label, 'code' => $a->code, 'source' => $a->source_type,
                    'amount' => ($a->amount < 0 ? '-' : '').$f(abs($a->amount)), 'included' => (bool) ($a->meta['included'] ?? false)])->values()->all(),
                'payments' => $order->payments->map(fn (Payment $p) => ['id' => $p->id, 'method' => $p->method_title ?? $p->method, 'amount' => $f($p->amount),
                    'status' => $p->status, 'reference' => $p->reference, 'paid_at' => $p->paid_at?->toIso8601String(), 'expires_at' => $p->expires_at?->toIso8601String(),
                    'refunded' => $p->refunded_amount > 0 ? $f($p->refunded_amount) : null])->values()->all(),
                'confirmations' => $order->confirmations->map(fn ($c) => ['id' => $c->id, 'sender_name' => $c->sender_name, 'sender_bank' => $c->sender_bank,
                    'amount' => $f($c->amount), 'status' => $c->status, 'created_at' => $c->created_at?->toIso8601String(),
                    'proof_url' => $c->proof_path !== null && $user->can('commerce.payments.verify') ? route('sunrice.admin.commerce.confirmations.proof', $c, false) : null,
                    'can_review' => $c->status === 'submitted' && $user->can('commerce.payments.verify')])->values()->all(),
                'shipments' => $order->shipments->map(fn ($s) => ['id' => $s->id, 'courier' => $s->courier_name ?? $s->courier, 'service' => $s->service,
                    'tracking_number' => $s->tracking_number, 'tracking_url' => $s->tracking_url, 'status' => $s->status,
                    'shipped_at' => $s->shipped_at?->toIso8601String(), 'delivered_at' => $s->delivered_at?->toIso8601String(),
                    'items' => collect((array) $s->items)->map(fn ($row) => ['name' => $order->items->firstWhere('id', $row['order_item_id'])?->title(), 'quantity' => $row['quantity']])->all()])->values()->all(),
                'refunds' => $order->refunds->map(fn ($r) => ['id' => $r->id, 'amount' => $f($r->amount), 'reason' => $r->reason, 'restock' => $r->restock,
                    'created_at' => $r->created_at?->toIso8601String()])->values()->all(),
                'downloads' => DownloadGrant::query()->with('file')->where('order_id', $order->id)->get()->map(fn ($g) => [
                    'id' => $g->id, 'name' => $g->file->name, 'count' => $g->download_count, 'remaining' => $g->downloads_remaining,
                    'expires_at' => $g->expires_at?->toIso8601String(), 'revoked' => $g->revoked_at !== null, 'state' => $g->refusal() ?? 'active',
                ])->all(),
                'documents' => commerce_feature('documents') && $user->can('commerce.documents.view') ? array_values(array_filter([
                    $order->isQuote() ? null : ['type' => 'invoice', 'label' => 'Invoice', 'number' => $order->documents->firstWhere('type', 'invoice')?->number, 'url' => route('sunrice.admin.commerce.orders.document', [$order, 'invoice'], false)],
                    $order->needsShipping() && ! $order->isQuote() ? ['type' => 'packing_slip', 'label' => 'Packing slip', 'number' => null, 'url' => route('sunrice.admin.commerce.orders.document', [$order, 'packing-slip'], false)] : null,
                    $order->isQuote() ? ['type' => 'quotation', 'label' => 'Quotation', 'number' => $order->quote_number, 'url' => route('sunrice.admin.commerce.orders.document', [$order, 'quotation'], false)] : null,
                ])) : [],
                'timeline' => $order->events->sortByDesc('id')->values()->map(fn (OrderEvent $e) => ['id' => $e->id, 'type' => $e->type, 'visibility' => $e->visibility,
                    'message' => $e->message, 'source' => $e->source, 'actor' => $e->data['actor'] ?? null, 'created_at' => $e->created_at?->toIso8601String()])->all(),
                'storefront_url' => $order->url(),
            ],
            'transitions' => collect(OrderStateMachine::TRANSITIONS[$order->type][$order->status] ?? [])
                // Failed comes from gateways; an unpaid order reaches Processing by recording its payment.
                ->filter(fn (string $to) => ! in_array($to, [OrderStatus::ACCEPTED, OrderStatus::FAILED], true) && in_array($to, $statuses, true)
                    && ! ($to === OrderStatus::PROCESSING && $order->status === OrderStatus::PENDING && $order->isUnpaid() && $order->total > 0))
                ->map(fn (string $to) => ['to' => $to, 'label' => OrderStatus::label($to), 'allowed' => $states->can($order, $to), 'reason' => $states->refusal($order, $to),
                    'permission' => $order->isQuote() ? $user->can('commerce.quotes.respond') && $to !== OrderStatus::QUOTED && $to !== OrderStatus::EXPIRED
                        : ($to === OrderStatus::CANCELLED ? $user->can('commerce.orders.cancel') : $user->can('commerce.orders.edit'))])
                ->values()->all(),
            'couriers' => collect($couriers->all())->map(fn ($c, $key) => ['key' => $key, 'name' => $c['name']])->values()->all(),
            'panels' => app(OrderPanels::class)->for($order, $user),
            'can' => [
                'edit' => $user->can('commerce.orders.edit'),
                'cancel' => $user->can('commerce.orders.cancel'),
                'refund' => $user->can('commerce.orders.refund') && $order->paid_total > $order->refunded_total,
                'delete' => $user->can('commerce.orders.delete'),
                'force_delete' => $user->can('commerce.orders.delete') && $order->trashed() && app(TrashOrder::class)->canForceDelete($order),
                'mark_paid' => $user->can('commerce.payments.verify') && ! $order->isQuote() && $order->isUnpaid() && $order->total > 0 && $order->status !== OrderStatus::CANCELLED,
                'shipments' => $user->can('commerce.shipments.manage') && commerce_feature('shipping') && $order->needsShipping() && ! $order->isQuote(),
                'edit_items' => $user->can('commerce.orders.edit') && app(EditOrder::class)->editable($order),
                'send_link' => $user->can('commerce.orders.edit') && ! $order->isQuote() && $order->isUnpaid() && $order->total > 0 && $order->isOpen(),
                'respond_quote' => $order->isQuote() && $user->can('commerce.quotes.respond') && in_array($order->status, [OrderStatus::REQUESTED, OrderStatus::QUOTED], true),
                'edit_addresses' => $user->can('commerce.orders.edit') && ! in_array($order->fulfillment_status, [OrderStatus::PARTIALLY_SHIPPED, OrderStatus::SHIPPED], true),
            ],
        ]);
    }

    public function transition(Request $request, Order $order, OrderStateMachine $states): RedirectResponse
    {
        $this->guard();
        $data = $request->validate(['to' => ['required', 'string'], 'reason' => ['nullable', 'string', 'max:255']]);
        $this->authorize($order->isQuote() ? 'commerce.quotes.respond' : ($data['to'] === OrderStatus::CANCELLED ? 'commerce.orders.cancel' : 'commerce.orders.edit'));
        try {
            $states->transition($order, $data['to'], Actor::admin($request->user()), $data['reason'] ?? null);
        } catch (InvalidTransition $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Status changed to '.OrderStatus::label($data['to']).'.');
    }

    public function note(Request $request, Order $order, AddOrderNote $notes): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.edit');
        $data = $request->validate(['message' => ['required', 'string', 'max:5000'], 'customer' => ['boolean']]);
        $notes->handle($order, $data['message'], (bool) ($data['customer'] ?? false), Actor::admin($request->user()));

        return back()->with('success', ($data['customer'] ?? false) ? 'Note sent to the customer.' : 'Note added.');
    }

    public function editAddresses(Order $order): Response
    {
        $this->guard();
        $this->authorize('commerce.orders.edit');
        $values = [];
        foreach (['shipping_address', 'billing_address'] as $key) {
            $a = (array) $order->{$key};
            $values[$key] = [...$a, 'region' => array_intersect_key($a, array_flip(['country', 'province_code', 'city_code', 'district_code', 'village_code']))];
        }

        return Inertia::render('Commerce/Shared/SchemaForm', [
            'title' => "Addresses of {$order->displayNumber()}",
            'form' => SchemaForm::make($this->addressFields($order), $values)->action(route('sunrice.admin.commerce.orders.addresses', $order, false), 'put'),
            'breadcrumbs' => [['label' => 'Shop', 'href' => 'commerce'], ['label' => 'Orders', 'href' => 'commerce/orders'], ['label' => $order->displayNumber(), 'href' => "commerce/orders/{$order->id}"]],
        ]);
    }

    public function addresses(Request $request, Order $order, UpdateOrderAddresses $update): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.edit');
        $values = SchemaForm::make($this->addressFields($order))->validate((array) $request->input('values', []));
        $flatten = function (?array $address): ?array {
            if ($address === null || trim((string) ($address['line1'] ?? '')) === '') {
                return null;
            }
            $region = (array) ($address['region'] ?? []);
            unset($address['region']);

            return [...$address, ...$region];
        };
        try {
            $update->handle($order, $flatten($values['shipping_address'] ?? null), $flatten($values['billing_address'] ?? null), Actor::admin($request->user()));
        } catch (ValidationException $e) {
            throw SchemaForm::prefixed($e);
        }

        return redirect()->route('sunrice.admin.commerce.orders.show', $order)->with('success', 'Addresses saved.');
    }

    /** @return array<int, array<string, mixed>> */
    protected function addressFields(Order $order): array
    {
        $address = fn (string $handle, string $label) => ['handle' => $handle, 'type' => 'group', 'label' => $label, 'config' => ['fields' => [
            ['handle' => 'name', 'type' => 'text', 'label' => 'Name', 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'phone', 'type' => 'text', 'label' => 'Phone', 'translatable' => false, 'config' => ['max' => 30]],
            ['handle' => 'company', 'type' => 'text', 'label' => 'Company', 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'region', 'type' => 'commerce_region', 'label' => 'Region', 'config' => ['depth' => 'village']],
            ['handle' => 'city', 'type' => 'text', 'label' => 'City (outside Indonesia)', 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'state', 'type' => 'text', 'label' => 'State (outside Indonesia)', 'translatable' => false, 'config' => ['max' => 120]],
            ['handle' => 'line1', 'type' => 'text', 'label' => 'Street address', 'translatable' => false, 'config' => ['max' => 255]],
            ['handle' => 'line2', 'type' => 'text', 'label' => 'Address line 2', 'translatable' => false, 'config' => ['max' => 255]],
            ['handle' => 'postal_code', 'type' => 'text', 'label' => 'Postal code', 'translatable' => false, 'config' => ['max' => 12]],
            ['handle' => 'notes', 'type' => 'text', 'label' => 'Notes for the courier', 'translatable' => false, 'config' => ['max' => 255]],
        ]]];

        return array_values(array_filter([
            $order->needsShipping() ? $address('shipping_address', 'Shipping address') : null,
            $address('billing_address', 'Billing address'),
        ]));
    }

    public function markPaid(Request $request, Order $order, MarkOrderPaid $mark): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.payments.verify');
        $data = $request->validate(['reference' => ['nullable', 'string', 'max:120'], 'paid_at' => ['nullable', 'date'], 'account' => ['nullable', 'string', 'max:120']]);
        try {
            $mark->handle($order, Actor::admin($request->user()), $data['reference'] ?? null, isset($data['paid_at']) ? Carbon::parse($data['paid_at']) : null, $data['account'] ?? null);
        } catch (DomainException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Payment recorded.');
    }

    public function storeShipment(Request $request, Order $order, CreateShipment $create): RedirectResponse
    {
        $this->guard();
        $this->authorizeFeature('shipping');
        $this->authorize('commerce.shipments.manage');
        $data = $request->validate([
            'courier' => ['nullable', 'string', 'max:40'], 'courier_name' => ['nullable', 'string', 'max:120', 'required_without:courier'],
            'service' => ['nullable', 'string', 'max:60'], 'tracking_number' => ['nullable', 'string', 'max:120'], 'cost' => ['nullable', 'integer', 'min:0'],
            'items' => ['required', 'array', 'max:500'], 'items.*.order_item_id' => ['required', 'integer'], 'items.*.quantity' => ['required', 'integer', 'min:0'],
        ]);
        $create->handle($order, $data, $data['items'], Actor::admin($request->user()));

        return back()->with('success', 'Shipment added.');
    }

    public function updateShipment(Request $request, Order $order, Shipment $shipment, UpdateShipment $update): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.shipments.manage');
        abort_unless($shipment->order_id === $order->id, 404);
        $data = $request->validate([
            'courier' => ['nullable', 'string', 'max:40'], 'courier_name' => ['nullable', 'string', 'max:120'], 'service' => ['nullable', 'string', 'max:60'],
            'tracking_number' => ['nullable', 'string', 'max:120'], 'status' => ['nullable', Rule::in(['shipped', 'in_transit', 'returned', 'cancelled'])],
        ]);
        $update->handle($shipment, $data, Actor::admin($request->user()));

        return back()->with('success', 'Shipment saved.');
    }

    public function deliveredShipment(Request $request, Order $order, Shipment $shipment, UpdateShipment $update): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.shipments.manage');
        abort_unless($shipment->order_id === $order->id, 404);
        $update->delivered($shipment, Actor::admin($request->user()));

        return back()->with('success', 'Marked delivered.');
    }

    public function storeRefund(Request $request, Order $order, RecordRefund $refunds): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.refund');
        $data = $request->validate([
            'amount' => ['required', 'integer', 'min:1'], 'reason' => ['nullable', 'string', 'max:255'], 'restock' => ['boolean'], 'gateway' => ['boolean'],
            'items' => ['array', 'max:500'], 'items.*.order_item_id' => ['required', 'integer'], 'items.*.quantity' => ['required', 'integer', 'min:0'],
        ]);
        $refunds->handle($order, (int) $data['amount'], $data['items'] ?? [], $data['reason'] ?? null, (bool) ($data['restock'] ?? false), Actor::admin($request->user()), (bool) ($data['gateway'] ?? false));

        return back()->with('success', 'Refund recorded.');
    }

    /** A document of the order, shown in the browser. */
    public function document(Order $order, string $type, Documents $documents): \Illuminate\Http\Response
    {
        $this->guard();
        $this->authorizeFeature('documents');
        $this->authorize('commerce.documents.view');
        abort_unless(in_array($type, ['invoice', 'packing-slip', 'quotation'], true), 404);
        $type = str_replace('-', '_', $type);
        abort_if(($type === 'quotation') !== $order->isQuote() && $type !== 'packing_slip', 404);

        return response($documents->pdf($order, $type), 200, ['Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.str_replace('/', '-', $order->displayNumber()).'-'.$type.'.pdf"']);
    }

    /** Packing slips of several orders in one PDF (?ids=1,2,3). */
    public function packingSlips(Request $request, Documents $documents): \Illuminate\Http\Response
    {
        $this->guard();
        $this->authorizeFeature('documents');
        $this->authorize('commerce.documents.view');
        $ids = array_slice(array_filter(array_map('intval', explode(',', (string) $request->query('ids')))), 0, 200);
        $orders = Order::query()->whereIn('id', $ids)->orderBy('id')->get();
        abort_if($orders->isEmpty(), 404);

        return response($documents->bulkPdf($orders), 200, ['Content-Type' => 'application/pdf', 'Content-Disposition' => 'inline; filename="packing-slips.pdf"']);
    }

    public function destroy(Request $request, Order $order, TrashOrder $trash): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.delete');
        $trash->trash($order);

        return redirect()->route('sunrice.admin.commerce.orders')->with('success', "Order {$order->displayNumber()} moved to the trash.");
    }

    public function restore(int $order, TrashOrder $trash): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.delete');
        $model = Order::onlyTrashed()->findOrFail($order);
        $trash->restore($model);

        return back()->with('success', 'Order restored.');
    }

    public function forceDelete(int $order, TrashOrder $trash): RedirectResponse
    {
        $this->guard();
        $this->authorize('commerce.orders.delete');
        $model = Order::onlyTrashed()->findOrFail($order);
        try {
            $trash->forceDelete($model);
        } catch (DomainException $e) {
            throw ValidationException::withMessages(['order' => $e->getMessage()]);
        }

        return redirect()->route('sunrice.admin.commerce.orders')->with('success', 'Order deleted for good.');
    }

    protected function guard(): void
    {
        $this->authorizeFeature('orders');
        $this->authorize('commerce.orders.view');
    }

    protected function table(Request $request): TableQuery
    {
        $table = TableQuery::for(Order::query()->withTrashed()->with('customer'))
            ->searchUsing(function (Builder $q, string $term): void {
                $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';
                $q->where(fn (Builder $w) => $w->whereLike('number', $like)->orWhereLike('quote_number', $like)->orWhereLike('customer_name', $like)
                    ->orWhereLike('email', $like)->orWhereLike('phone', $like)
                    ->orWhereHas('items', fn (Builder $i) => $i->whereLike('sku', $like)));
            })
            ->filter('type', fn (Builder $q, mixed $v) => $q->where('type', $v))
            ->filter('status', fn (Builder $q, mixed $v) => $q->where('status', $v))
            ->filter('payment', fn (Builder $q, mixed $v) => $q->where('payment_status', $v))
            ->filter('fulfillment', fn (Builder $q, mixed $v) => $q->where('fulfillment_status', $v))
            ->filter('payment_method', fn (Builder $q, mixed $v) => $q->where('payment_method', $v))
            ->filter('shipping_method', fn (Builder $q, mixed $v) => $q->where('shipping_method->method', $v))
            ->filter('channel', fn (Builder $q, mixed $v) => $q->where('channel', $v))
            ->filter('voucher', fn (Builder $q, mixed $v) => $q->whereHas('adjustments', fn (Builder $a) => $a->where('source_type', 'voucher')->where('code', mb_strtoupper((string) $v))))
            ->filter('date', fn (Builder $q, mixed $v) => match ($v) {
                'today' => $q->where('placed_at', '>=', now()->startOfDay()),
                '7d' => $q->where('placed_at', '>=', now()->subDays(7)->startOfDay()),
                '30d' => $q->where('placed_at', '>=', now()->subDays(30)->startOfDay()),
                'month' => $q->where('placed_at', '>=', now()->startOfMonth()),
                'last_month' => $q->whereBetween('placed_at', [now()->subMonthNoOverflow()->startOfMonth(), now()->subMonthNoOverflow()->endOfMonth()]),
                // "2026-03-01..2026-03-31": local dates, from report drill-downs.
                default => is_string($v) && preg_match('/^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/', $v, $m) === 1
                    ? $q->where('placed_at', '>=', Day::bounds($m[1])[0])->where('placed_at', '<', Day::bounds($m[2])[1])
                    : $q,
            })
            ->filter('trashed', fn (Builder $q, mixed $v) => $v === 'only' ? $q->whereNotNull('deleted_at') : $q)
            ->sortable(['number', 'placed_at', 'total', 'status'])
            ->apply($request);
        if (($table->meta()['filters']['trashed'] ?? null) !== 'only') {
            $table->builder()->whereNull('deleted_at');
        }
        if ($table->meta()['sort'] === null) {
            $table->builder()->latest('placed_at')->latest('id');
        }

        return $table;
    }

    /** @return array<int, Column> */
    protected function columns(): array
    {
        return [
            new Column('number', 'Number', sortable: true),
            new Column('date', 'Date'),
            new Column('customer', 'Customer'),
            new Column('status', 'Status', type: 'badge'),
            new Column('payment', 'Payment', type: 'badge'),
            new Column('fulfillment', 'Shipping', type: 'badge'),
            new Column('total', 'Total', sortable: true),
            new Column('items', 'Items'),
            new Column('payment_method', 'Payment method'),
            new Column('shipping_method', 'Shipping method'),
            new Column('city', 'City'),
            new Column('channel', 'Channel'),
            new Column('email', 'Email'),
            new Column('phone', 'Phone'),
        ];
    }

    /** @return array<string, mixed> */
    protected function row(Order $order, MoneyFormatter $money): array
    {
        $tone = fn (string $status) => match ($status) {
            'completed', 'paid', 'shipped', 'accepted' => 'ok',
            'processing', 'quoted', 'partially_shipped', 'awaiting_confirmation', 'partially_refunded' => 'info',
            'pending', 'requested', 'on_hold', 'unpaid', 'unfulfilled' => 'warning',
            'cancelled', 'failed', 'refunded', 'declined', 'expired' => 'error',
            default => 'neutral',
        };

        return [
            'id' => $order->id,
            'href' => "commerce/orders/{$order->id}",
            'number' => $order->displayNumber().($order->isQuote() ? ' (quote)' : ''),
            'date' => $order->placed_at?->isoFormat('D MMM YYYY HH:mm'),
            'customer' => $order->customer_name ?? $order->email,
            'status' => OrderStatus::label($order->status), 'status_tone' => $order->trashed() ? 'neutral' : $tone($order->status),
            'payment' => $order->isQuote() ? null : ($order->payment_method === 'whatsapp' && $order->isUnpaid() ? $order->payment_method_title : OrderStatus::label($order->payment_status, 'payment')),
            'payment_tone' => $tone($order->payment_status),
            'fulfillment' => $order->isQuote() ? null : OrderStatus::label($order->fulfillment_status, 'fulfillment'), 'fulfillment_tone' => $tone($order->fulfillment_status),
            'total' => $money->format($order->total),
            'items' => (string) (int) ($order->getAttribute('items_quantity') ?? $order->items()->whereNull('parent_id')->sum('quantity')),
            'payment_method' => $order->payment_method_title,
            'shipping_method' => $order->shipping_method['label'] ?? null,
            'city' => $order->shipping_address['city'] ?? null,
            'channel' => $order->channel,
            'email' => $order->email,
            'phone' => $order->phone,
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected function filters(): array
    {
        $options = fn (array $statuses, string $kind = 'status') => OrderStatus::options($statuses, $kind);
        $methods = Order::query()->whereNotNull('payment_method')->distinct()->pluck('payment_method_title', 'payment_method');

        return [
            ['key' => 'type', 'label' => 'Type', 'type' => 'select', 'options' => [['value' => 'order', 'label' => 'Orders'], ['value' => 'quote', 'label' => 'Quotes']]],
            ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => $options(array_values(array_unique([...OrderStatus::ORDER_STATUSES, ...OrderStatus::QUOTE_STATUSES])))],
            ['key' => 'payment', 'label' => 'Payment', 'type' => 'select', 'options' => $options(OrderStatus::PAYMENT_STATUSES, 'payment')],
            ['key' => 'fulfillment', 'label' => 'Shipping', 'type' => 'select', 'options' => $options(OrderStatus::FULFILLMENT_STATUSES, 'fulfillment')],
            ['key' => 'payment_method', 'label' => 'Payment method', 'type' => 'select', 'options' => $methods->map(fn ($title, $key) => ['value' => $key, 'label' => $title ?: $key])->values()->all()],
            ['key' => 'shipping_method', 'label' => 'Shipping method', 'type' => 'select', 'options' => [
                ['value' => 'flat', 'label' => 'Flat rate'], ['value' => 'weight', 'label' => 'By weight'], ['value' => 'free', 'label' => 'Free'], ['value' => 'pickup', 'label' => 'Pickup'],
            ]],
            ['key' => 'date', 'label' => 'Date', 'type' => 'select', 'options' => [
                ['value' => 'today', 'label' => 'Today'], ['value' => '7d', 'label' => 'Last 7 days'], ['value' => '30d', 'label' => 'Last 30 days'],
                ['value' => 'month', 'label' => 'This month'], ['value' => 'last_month', 'label' => 'Last month'],
            ]],
            ['key' => 'channel', 'label' => 'Channel', 'type' => 'select', 'options' => array_map(fn ($c) => ['value' => $c, 'label' => ucfirst($c)], ['storefront', 'admin', 'whatsapp', 'mcp', 'api'])],
            ['key' => 'trashed', 'label' => 'Trash', 'type' => 'select', 'options' => [['value' => 'only', 'label' => 'In the trash']]],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    protected function bulkActions(Request $request): array
    {
        $actions = [];
        if ($request->user()->can('commerce.orders.edit')) {
            $actions[] = ['key' => 'processing', 'label' => 'Mark processing'];
            $actions[] = ['key' => 'completed', 'label' => 'Mark completed'];
        }
        if (commerce_feature('documents') && $request->user()->can('commerce.documents.view')) {
            $actions[] = ['key' => 'packing_slips', 'label' => 'Print packing slips'];
        }
        if ($request->user()->can('commerce.orders.delete')) {
            $actions[] = ['key' => 'trash', 'label' => 'Move to trash', 'variant' => 'destructive', 'confirm' => 'Move the selected orders to the trash?'];
        }

        return $actions;
    }

    /** @return array{type: string, label: string|null} */
    protected function priceSource(OrderItem $item): array
    {
        $source = (array) $item->price_source;
        $labels = ['base' => 'Regular price', 'flash_sale' => 'Flash sale', 'price_rule' => 'Pricing rule', 'tier' => 'Bulk price', 'manual' => 'Set by staff', 'quote' => 'Quoted'];

        return ['type' => (string) ($source['type'] ?? 'base'), 'label' => trim(($labels[$source['type'] ?? 'base'] ?? ucfirst((string) ($source['type'] ?? ''))).(isset($source['label']) && $source['label'] ? ': '.$source['label'] : ''))];
    }
}
