<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Support\AddressRules;

/** Staff correct the addresses until something has shipped. */
class UpdateOrderAddresses
{
    public function __construct(protected Timeline $timeline) {}

    /**
     * @param  array<string, mixed>|null  $shipping
     * @param  array<string, mixed>|null  $billing
     *
     * @throws ValidationException
     */
    public function handle(Order $order, ?array $shipping, ?array $billing, Actor $actor): Order
    {
        if (in_array($order->fulfillment_status, [OrderStatus::PARTIALLY_SHIPPED, OrderStatus::SHIPPED], true)) {
            throw ValidationException::withMessages(['shipping_address' => 'Addresses can\'t be changed once something has shipped.']);
        }
        $rules = [];
        foreach (['shipping_address' => $shipping, 'billing_address' => $billing] as $key => $address) {
            if ($address !== null) {
                $rules += AddressRules::rules($key, ['phone' => false]);
            }
        }
        $validator = Validator::make(['shipping_address' => $shipping, 'billing_address' => $billing], $rules);
        $validator->after(function ($v) use ($shipping, $billing): void {
            if ($shipping !== null) {
                AddressRules::after($v, 'shipping_address');
            }
            if ($billing !== null) {
                AddressRules::after($v, 'billing_address');
            }
        });
        $validator->validate();

        $changes = [];
        if ($shipping !== null) {
            $order->shipping_address = AddressRules::normalize($shipping)->toArray();
            $changes[] = 'shipping_address';
        }
        if ($billing !== null) {
            $order->billing_address = AddressRules::normalize($billing)->toArray();
            $changes[] = 'billing_address';
        }
        $order->version++;
        $order->save();
        $this->timeline->record($order, 'edit', __('commerce::orders.timeline.addresses'), ['changes' => $changes], $actor);

        return $order;
    }
}
