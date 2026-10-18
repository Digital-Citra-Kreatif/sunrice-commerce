<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Models\Order;

#[IsReadOnly]
#[Description('One customer by id or email: contact details, saved addresses, marketing consent, the staff note and their latest orders.')]
class GetCustomerTool extends CommerceTool
{
    protected string $name = 'get_customer';

    protected ?string $permission = 'commerce.customers.view';

    protected function run(Request $request): Response
    {
        $key = (string) $request->get('customer', '');
        $customer = ctype_digit($key) ? Customer::query()->find((int) $key) : Customer::query()->where('email', mb_strtolower($key))->first();
        if ($customer === null || $customer->anonymized_at !== null) {
            return $this->notFound('Customer');
        }
        $orders = Order::query()->where('customer_id', $customer->id)->latest('id')->limit(10)->get();

        return $this->json([
            ...ListCustomersTool::row($customer),
            'accepts_marketing' => $customer->accepts_marketing, 'note' => $customer->note,
            'addresses' => $customer->addresses()->get()->map(fn ($a) => $a->toArray())->all(),
            'latest_orders' => $orders->map(fn (Order $o) => OrderData::summary($o))->all(),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return ['customer' => $schema->string()->description('Customer id or email.')->required()];
    }
}
