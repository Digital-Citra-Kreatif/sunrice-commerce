<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Models\Order;

#[IsReadOnly]
#[Description('One order or quote by id or number: items, totals, addresses, payment, shipments, refunds, the latest timeline entries and next_statuses (what update_order can change its status to).')]
class GetOrderTool extends CommerceTool
{
    protected string $name = 'get_order';

    protected ?string $feature = 'orders';

    protected ?string $permission = 'commerce.orders.view';

    protected function run(Request $request): Response
    {
        $order = self::find($request->get('order'));

        return $order === null ? $this->notFound('Order') : $this->json(OrderData::detail($order));
    }

    /** An order by id or (quote) number. */
    public static function find(mixed $key): ?Order
    {
        if ($key === null || $key === '') {
            return null;
        }

        return is_numeric($key) && ! str_contains((string) $key, '-')
            ? Order::query()->find((int) $key)
            : Order::query()->where('number', (string) $key)->orWhere('quote_number', (string) $key)->first();
    }

    public function schema(JsonSchema $schema): array
    {
        return ['order' => $schema->string()->description('The order\'s id or number (e.g. ORD-20260310-0001).')->required()];
    }
}
