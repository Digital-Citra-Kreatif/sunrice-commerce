<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;

#[IsReadOnly]
#[Description('List orders or quotes, newest first. Filter by type (order, quote), status, payment_status, fulfillment_status, a date range (from, to: Y-m-d) and search (number, name, email, phone or SKU). Use get_order for one order\'s items, addresses, shipments and timeline.')]
class ListOrdersTool extends CommerceTool
{
    protected string $name = 'list_orders';

    protected ?string $feature = 'orders';

    protected ?string $permission = 'commerce.orders.view';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'type' => ['nullable', 'in:order,quote'],
            'status' => ['nullable', 'string', 'max:30'], 'payment_status' => ['nullable', 'in:'.implode(',', OrderStatus::PAYMENT_STATUSES)],
            'fulfillment_status' => ['nullable', 'in:'.implode(',', OrderStatus::FULFILLMENT_STATUSES)],
            'from' => ['nullable', 'date_format:Y-m-d'], 'to' => ['nullable', 'date_format:Y-m-d'],
            'search' => ['nullable', 'string', 'max:120'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $query = Order::query()->where('type', $args['type'] ?? 'order')->latest('id');
        foreach (['status', 'payment_status', 'fulfillment_status'] as $column) {
            if (! empty($args[$column])) {
                $query->where($column, $args[$column]);
            }
        }
        $date = (string) (($args['type'] ?? 'order') === 'quote' ? 'created_at' : 'placed_at');
        if (! empty($args['from'])) {
            $query->where($date, '>=', Day::bounds($args['from'])[0]);
        }
        if (! empty($args['to'])) {
            $query->where($date, '<', Day::bounds($args['to'])[1]);
        }
        if (! empty($args['search'])) {
            $like = '%'.$args['search'].'%';
            $query->where(fn (Builder $q) => $q->whereLike('number', $like)->orWhereLike('quote_number', $like)->orWhereLike('customer_name', $like)
                ->orWhereLike('email', $like)->orWhereLike('phone', $like)
                ->orWhereHas('items', fn (Builder $i) => $i->whereLike('sku', $like)));
        }
        $total = (clone $query)->count();
        $orders = $query->limit((int) ($args['limit'] ?? 25))->get();

        return $this->json(['total' => $total, 'orders' => $orders->map(fn (Order $o) => OrderData::summary($o))->all()]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()->enum(['order', 'quote'])->description('Orders (default) or quotes.'),
            'status' => $schema->string()->description('Orders: pending, on_hold, processing, completed, cancelled, refunded, failed. Quotes: requested, quoted, accepted, declined, expired, cancelled.'),
            'payment_status' => $schema->string()->enum(OrderStatus::PAYMENT_STATUSES),
            'fulfillment_status' => $schema->string()->enum(OrderStatus::FULFILLMENT_STATUSES),
            'from' => $schema->string()->description('First date (Y-m-d, the store\'s timezone).'),
            'to' => $schema->string()->description('Last date (Y-m-d).'),
            'search' => $schema->string()->description('Number, customer name, email, phone or SKU.'),
            'limit' => $schema->integer()->description('How many (default 25, at most 100).'),
        ];
    }
}
