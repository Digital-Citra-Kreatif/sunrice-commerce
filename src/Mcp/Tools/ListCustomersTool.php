<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;

#[IsReadOnly]
#[Description('List customers (people who ordered or have an account): name, email, phone, orders and amount spent. Search by name, email or phone; sort by recent, spent or orders.')]
class ListCustomersTool extends CommerceTool
{
    protected string $name = 'list_customers';

    protected ?string $permission = 'commerce.customers.view';

    protected function run(Request $request): Response
    {
        $args = $request->validate(['search' => ['nullable', 'string', 'max:120'], 'sort' => ['nullable', 'in:recent,spent,orders'], 'limit' => ['nullable', 'integer', 'min:1', 'max:100']]);
        $query = Customer::query()->whereNull('anonymized_at');
        if (! empty($args['search'])) {
            $like = '%'.$args['search'].'%';
            $query->where(fn (Builder $q) => $q->whereLike('name', $like)->orWhereLike('email', $like)->orWhereLike('phone', $like));
        }
        match ($args['sort'] ?? 'recent') {
            'spent' => $query->orderByDesc('total_spent'),
            'orders' => $query->orderByDesc('orders_count'),
            default => $query->orderByDesc('last_order_at')->orderByDesc('id'),
        };
        $total = (clone $query)->count();

        return $this->json(['total' => $total, 'customers' => $query->limit((int) ($args['limit'] ?? 25))->get()->map(fn (Customer $c) => self::row($c))->all()]);
    }

    /** @return array<string, mixed> */
    public static function row(Customer $c): array
    {
        return ['id' => $c->id, 'name' => $c->name, 'email' => $c->email, 'phone' => $c->phone, 'has_account' => $c->user_id !== null,
            'orders' => $c->orders_count, 'spent' => OrderData::money($c->total_spent), 'last_order_at' => $c->last_order_at?->toIso8601String()];
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->description('Name, email or phone.'),
            'sort' => $schema->string()->enum(['recent', 'spent', 'orders']),
            'limit' => $schema->integer(),
        ];
    }
}
