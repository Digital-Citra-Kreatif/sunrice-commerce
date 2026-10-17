<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Actions\RecordRefund;

#[IsDestructive]
#[Description('Record a refund on a paid order (money already returned to the customer, e.g. by bank transfer). amount is in the smallest currency unit, at most paid minus refunded; items {item_id, quantity} mark what came back and restock puts them back in stock. Needs confirm: true — ask the user first.')]
class RefundOrderTool extends CommerceTool
{
    protected string $name = 'refund_order';

    protected ?string $feature = 'orders';

    protected ?string $permission = 'commerce.orders.refund';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'order' => ['required'], 'amount' => ['required', 'integer', 'min:1'], 'reason' => ['nullable', 'string', 'max:255'],
            'items' => ['nullable', 'array'], 'items.*.item_id' => ['required', 'integer'], 'items.*.quantity' => ['required', 'integer', 'min:1'],
            'restock' => ['boolean'], 'confirm' => ['boolean'],
        ]);
        $order = GetOrderTool::find($args['order']);
        if ($order === null) {
            return $this->notFound('Order');
        }
        if (($refused = $this->unconfirmed($request, 'record a refund of '.OrderData::money((int) $args['amount'])['formatted']." on order {$order->displayNumber()}")) !== null) {
            return $refused;
        }
        $refund = app(RecordRefund::class)->handle($order, (int) $args['amount'],
            array_map(fn (array $i) => ['order_item_id' => (int) $i['item_id'], 'quantity' => (int) $i['quantity']], $args['items'] ?? []),
            $args['reason'] ?? null, (bool) ($args['restock'] ?? false), $this->actor());

        return $this->json(['refund_id' => $refund->id, 'order' => OrderData::detail($order->refresh())]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'order' => $schema->string()->description('The order\'s id or number.')->required(),
            'amount' => $schema->integer()->description('The amount refunded, in the smallest currency unit.')->required(),
            'reason' => $schema->string(),
            'items' => $schema->array()->items($schema->object(['item_id' => $schema->integer()->required(), 'quantity' => $schema->integer()->required()])),
            'restock' => $schema->boolean()->description('Put the returned items back in stock.'),
            'confirm' => $schema->boolean()->description('true once the user agreed.'),
        ];
    }
}
