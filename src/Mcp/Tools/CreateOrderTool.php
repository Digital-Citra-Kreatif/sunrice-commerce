<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Sunrice\Commerce\Mcp\CommerceTool;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Actions\CreateManualOrder;

#[Description('Create a manual order (a phone, chat or walk-in sale), like Orders → New in the admin. Lines are variant ids (see get_product) with quantities; today\'s prices apply unless unit_price is given, which needs the "change unit prices" permission. Optional hand-set shipping {label, cost} and discount {label, amount}. payment_status "paid" records the payment; "unpaid" with send_link emails the customer a payment link.')]
class CreateOrderTool extends CommerceTool
{
    protected string $name = 'create_order';

    protected ?string $feature = 'orders';

    protected ?string $permission = 'commerce.orders.create';

    protected function run(Request $request): Response
    {
        $order = app(CreateManualOrder::class)->handle([...$request->all(), 'payment_status' => $request->get('payment_status', 'unpaid')], $this->actor(), auth()->user());

        return $this->json(['created' => true, 'order' => OrderData::detail($order)]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'customer_id' => $schema->integer()->description('An existing customer (list_customers), or give email.'),
            'email' => $schema->string()->description('The customer\'s email (a customer is created if new).'),
            'name' => $schema->string(), 'phone' => $schema->string(),
            'lines' => $schema->array()->items($schema->object([
                'variant_id' => $schema->integer()->required(), 'quantity' => $schema->integer()->required(),
                'unit_price' => $schema->integer()->description('Override the price (smallest currency unit).'),
            ]))->required(),
            'shipping_address' => $schema->object()->description('{name, phone, line1, line2, country, province_code, city_code, district_code, postal_code}.'),
            'shipping' => $schema->object(['label' => $schema->string(), 'cost' => $schema->integer()])->description('Hand-set shipping.'),
            'discount' => $schema->object(['label' => $schema->string(), 'amount' => $schema->integer()])->description('A discount off the order.'),
            'payment_status' => $schema->string()->enum(['unpaid', 'paid']),
            'payment_method' => $schema->string()->description('A payment method key, e.g. bank_transfer.'),
            'reference' => $schema->string()->description('Payment reference when paid.'),
            'note' => $schema->string()->description('An internal note.'),
            'send_link' => $schema->boolean()->description('Email a payment link (unpaid orders).'),
        ];
    }
}
