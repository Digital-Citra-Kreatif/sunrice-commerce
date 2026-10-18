<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Actions\AddOrderNote;
use Sunrice\Commerce\Orders\Actions\CreateShipment;
use Sunrice\Commerce\Orders\Actions\MarkOrderPaid;
use Sunrice\Commerce\Orders\Actions\UpdateOrderAddresses;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;

#[Description('Change an order the way staff do in the admin, one or more of: status (with a reason; see get_order\'s next_statuses), a note (to_customer emails it), a shipment with tracking (all unshipped items unless items is given), marking it paid, and its addresses. Cancelling and marking paid need confirm: true — ask the user first. Each change needs its own permission.')]
class UpdateOrderTool extends CommerceTool
{
    protected string $name = 'update_order';

    protected ?string $feature = 'orders';

    protected ?string $permission = 'commerce.orders.view';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'order' => ['required'],
            'status' => ['nullable', 'string', 'max:30'], 'reason' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:5000'], 'to_customer' => ['boolean'],
            'shipment' => ['nullable', 'array'], 'shipment.courier' => ['required_with:shipment', 'string', 'max:120'],
            'shipment.service' => ['nullable', 'string', 'max:60'], 'shipment.tracking_number' => ['nullable', 'string', 'max:120'],
            'shipment.items' => ['nullable', 'array'], 'shipment.items.*.item_id' => ['required', 'integer'], 'shipment.items.*.quantity' => ['required', 'integer', 'min:1'],
            'mark_paid' => ['boolean'], 'reference' => ['nullable', 'string', 'max:120'],
            'shipping_address' => ['nullable', 'array'], 'billing_address' => ['nullable', 'array'],
            'confirm' => ['boolean'],
        ]);
        $order = GetOrderTool::find($args['order']);
        if ($order === null) {
            return $this->notFound('Order');
        }
        $actor = $this->actor();
        $done = [];

        if (! empty($args['status'])) {
            $to = (string) $args['status'];
            $this->authorize($order->isQuote() ? 'commerce.quotes.respond' : ($to === OrderStatus::CANCELLED ? 'commerce.orders.cancel' : 'commerce.orders.edit'));
            if ($to === OrderStatus::CANCELLED && ($refused = $this->unconfirmed($request, "cancel order {$order->displayNumber()}")) !== null) {
                return $refused;
            }
            app(OrderStateMachine::class)->transition($order, $to, $actor, $args['reason'] ?? null);
            $done[] = 'status';
        }
        if (! empty($args['mark_paid'])) {
            $this->authorize('commerce.payments.verify');
            if (($refused = $this->unconfirmed($request, "mark order {$order->displayNumber()} as paid")) !== null) {
                return $refused;
            }
            app(MarkOrderPaid::class)->handle($order->refresh(), $actor, $args['reference'] ?? null);
            $done[] = 'paid';
        }
        if (! empty($args['shipment'])) {
            if (! app(Features::class)->active('shipping')) {
                return Response::error('Shipping is switched off in this store.');
            }
            $this->authorize('commerce.shipments.manage');
            $order->refresh()->load('items');
            $items = isset($args['shipment']['items'])
                ? array_map(fn (array $i) => ['order_item_id' => (int) $i['item_id'], 'quantity' => (int) $i['quantity']], $args['shipment']['items'])
                : $order->items->whereNull('parent_id')->where('requires_shipping', true)
                    ->map(fn ($i) => ['order_item_id' => $i->id, 'quantity' => $i->quantity - $i->fulfilled_quantity])
                    ->filter(fn (array $i) => $i['quantity'] > 0)->values()->all();
            app(CreateShipment::class)->handle($order, [
                'courier_name' => $args['shipment']['courier'], 'service' => $args['shipment']['service'] ?? null,
                'tracking_number' => $args['shipment']['tracking_number'] ?? null,
            ], $items, $actor);
            $done[] = 'shipment';
        }
        if (! empty($args['shipping_address']) || ! empty($args['billing_address'])) {
            $this->authorize('commerce.orders.edit');
            app(UpdateOrderAddresses::class)->handle($order->refresh(), $args['shipping_address'] ?? $order->shipping_address,
                $args['billing_address'] ?? $order->billing_address, $actor);
            $done[] = 'addresses';
        }
        if (! empty($args['note'])) {
            $this->authorize('commerce.orders.edit');
            app(AddOrderNote::class)->handle($order, (string) $args['note'], (bool) ($args['to_customer'] ?? false), $actor);
            $done[] = 'note';
        }
        if ($done === []) {
            return Response::error('Nothing to change: pass status, note, shipment, mark_paid or an address.');
        }

        return $this->json(['changed' => $done, 'order' => OrderData::detail($order->refresh())]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'order' => $schema->string()->description('The order\'s id or number.')->required(),
            'status' => $schema->string()->description('The new status: processing, on_hold, completed, cancelled… (see get_order next_statuses).'),
            'reason' => $schema->string()->description('Why (kept on the timeline; shown to the customer for cancellations).'),
            'note' => $schema->string()->description('A note for the timeline.'),
            'to_customer' => $schema->boolean()->description('Email the note to the customer.'),
            'shipment' => $schema->object([
                'courier' => $schema->string()->description('Courier name, e.g. JNE.')->required(),
                'service' => $schema->string()->description('Service, e.g. REG.'),
                'tracking_number' => $schema->string(),
                'items' => $schema->array()->items($schema->object(['item_id' => $schema->integer()->required(), 'quantity' => $schema->integer()->required()]))
                    ->description('Only these items (get_order item ids); default: everything not shipped yet.'),
            ])->description('Add a shipment with tracking.'),
            'mark_paid' => $schema->boolean()->description('Record the full payment as received (needs confirm).'),
            'reference' => $schema->string()->description('Payment reference for mark_paid.'),
            'shipping_address' => $schema->object()->description('The whole address, in the shape get_order returns.'),
            'billing_address' => $schema->object()->description('The whole address, in the shape get_order returns.'),
            'confirm' => $schema->boolean()->description('true once the user agreed (cancelling, marking paid).'),
        ];
    }
}
