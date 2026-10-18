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
use Sunrice\Commerce\Orders\Actions\StaffPricing;
use Sunrice\Commerce\Shipping\ShippingManager;
use Sunrice\Commerce\Shipping\ShippingRate;
use Sunrice\Commerce\Shipping\ShippingRequest;

#[IsReadOnly]
#[Description('Shipping options and costs for products to a destination, as checkout would offer them (e.g. to answer "how much is shipping to Bandung?"). lines are variant ids and quantities (get_product); destination is {country, province_code, city_code, district_code, postal_code} with region codes from the store\'s region list.')]
class QuoteShippingTool extends CommerceTool
{
    protected string $name = 'quote_shipping';

    protected ?string $feature = 'shipping';

    protected ?string $permission = 'commerce.orders.view';

    protected function run(Request $request): Response
    {
        $args = $request->validate([
            'lines' => ['required', 'array', 'min:1', 'max:100'], 'lines.*.variant_id' => ['required', 'integer'], 'lines.*.quantity' => ['required', 'integer', 'min:1'],
            'destination' => ['required', 'array'], 'destination.country' => ['required', 'string', 'size:2'],
        ]);
        $state = app(StaffPricing::class)->calculate($args['lines'], null, $args['destination'], [], auth()->user());
        if ($state->isEmpty()) {
            return Response::error('None of these variants can be sold.');
        }
        $shipping = ShippingRequest::fromState($state);

        return $this->json([
            'weight_grams' => $shipping->package->weight(),
            'subtotal' => OrderData::money($shipping->subtotal),
            'rates' => array_map(fn (ShippingRate $r) => ['id' => $r->id(), 'label' => $r->label, 'cost' => OrderData::money($r->cost), 'eta' => $r->etd],
                app(ShippingManager::class)->quote($shipping)),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'lines' => $schema->array()->items($schema->object(['variant_id' => $schema->integer()->required(), 'quantity' => $schema->integer()->required()]))->required(),
            'destination' => $schema->object()->description('{country: "ID", province_code, city_code, district_code, postal_code}.')->required(),
        ];
    }
}
