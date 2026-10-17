<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\ShipmentCreated;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Shipping\Couriers;

/**
 * A parcel for some or all of what's left to ship. Quantities can't
 * exceed what's left; the order's fulfilment status follows (partially
 * shipped, shipped).
 */
class CreateShipment
{
    public function __construct(protected Couriers $couriers, protected Timeline $timeline) {}

    /**
     * @param  array{courier?: string|null, courier_name?: string|null, service?: string|null, tracking_number?: string|null, cost?: int|null}  $details
     * @param  array<int, array{order_item_id: int, quantity: int}>  $items
     *
     * @throws ValidationException
     */
    public function handle(Order $order, array $details, array $items, Actor $actor): Shipment
    {
        if ($order->isQuote() || ! $order->needsShipping() || ! in_array($order->status, [OrderStatus::PROCESSING, OrderStatus::COMPLETED, OrderStatus::ON_HOLD], true)) {
            throw ValidationException::withMessages(['items' => 'Only processing orders with something to ship can get a shipment.']);
        }
        $shipment = DB::transaction(function () use ($order, $details, $items, $actor): Shipment {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            $lines = $locked->items()->whereNull('parent_id')->get()->keyBy('id');
            $rows = [];
            foreach ($items as $row) {
                $qty = (int) $row['quantity'];
                if ($qty <= 0) {
                    continue;
                }
                /** @var OrderItem|null $item */
                $item = $lines->get((int) $row['order_item_id']);
                if ($item === null || $qty > $item->unfulfilled()) {
                    throw ValidationException::withMessages(['items' => 'A quantity is more than is left to ship.']);
                }
                $rows[] = ['order_item_id' => $item->id, 'quantity' => $qty];
                $item->increment('fulfilled_quantity', $qty);
            }
            if ($rows === []) {
                throw ValidationException::withMessages(['items' => 'Choose what is in this parcel.']);
            }
            $courier = $details['courier'] ?? null;
            $preset = $courier !== null && $courier !== '' ? $this->couriers->get($courier) : null;
            $tracking = isset($details['tracking_number']) ? trim((string) $details['tracking_number']) : null;
            $shipment = Shipment::query()->create([
                'order_id' => $locked->id,
                'courier' => $preset !== null ? $courier : null,
                'courier_name' => $preset['name'] ?? ($details['courier_name'] ?? null),
                'service' => $details['service'] ?? null,
                'tracking_number' => $tracking ?: null,
                'tracking_url' => $this->couriers->trackingUrl($preset !== null ? $courier : null, $tracking),
                'status' => 'shipped',
                'items' => $rows,
                'cost' => $details['cost'] ?? null,
                'shipped_at' => now(),
                'created_by' => $actor->userId,
            ]);
            $this->refreshStatus($locked);
            $this->timeline->record($locked, 'shipment', __('commerce::orders.timeline.shipment', ['courier' => $shipment->courier_name ?? '—']).($tracking ? " ({$tracking})" : ''),
                ['shipment_id' => $shipment->id], $actor, 'customer');

            return $shipment;
        });
        $order->refresh();
        DB::afterCommit(fn () => ShipmentCreated::dispatch($order, $shipment));

        return $shipment;
    }

    /** Shipped when every shippable line is fully sent, partially when some is. */
    public function refreshStatus(Order $order): void
    {
        $lines = $order->items()->whereNull('parent_id')->where('requires_shipping', true)->get();
        $left = $lines->sum(fn (OrderItem $i) => $i->unfulfilled());
        $sent = $lines->sum('fulfilled_quantity');
        $order->forceFill([
            'fulfillment_status' => $lines->isEmpty() ? OrderStatus::NOT_REQUIRED : ($left === 0 ? OrderStatus::SHIPPED : ($sent > 0 ? OrderStatus::PARTIALLY_SHIPPED : OrderStatus::UNFULFILLED)),
            'version' => $order->version + 1,
        ])->save();
    }
}
