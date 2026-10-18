<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\ShipmentDelivered;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Shipping\Couriers;

/** Correct a shipment's courier or tracking, or mark it delivered. */
class UpdateShipment
{
    public function __construct(protected Couriers $couriers, protected Timeline $timeline) {}

    /** @param  array{courier?: string|null, courier_name?: string|null, service?: string|null, tracking_number?: string|null, status?: string|null}  $details */
    public function handle(Shipment $shipment, array $details, Actor $actor): Shipment
    {
        $courier = array_key_exists('courier', $details) ? $details['courier'] : $shipment->courier;
        $preset = $courier ? $this->couriers->get($courier) : null;
        $tracking = array_key_exists('tracking_number', $details) ? (trim((string) $details['tracking_number']) ?: null) : $shipment->tracking_number;
        $shipment->fill([
            'courier' => $preset !== null ? $courier : null,
            'courier_name' => $preset['name'] ?? ($details['courier_name'] ?? $shipment->courier_name),
            'service' => $details['service'] ?? $shipment->service,
            'tracking_number' => $tracking,
            'tracking_url' => $this->couriers->trackingUrl($preset !== null ? $courier : null, $tracking),
            'status' => in_array($details['status'] ?? null, ['shipped', 'in_transit', 'returned', 'cancelled'], true) ? $details['status'] : $shipment->status,
        ])->save();
        $this->timeline->record($shipment->order, 'shipment', __('commerce::orders.timeline.shipment_updated').($tracking ? " ({$tracking})" : ''), ['shipment_id' => $shipment->id], $actor);

        return $shipment;
    }

    public function delivered(Shipment $shipment, Actor $actor): Shipment
    {
        if ($shipment->status === 'delivered') {
            return $shipment;
        }
        $shipment->forceFill(['status' => 'delivered', 'delivered_at' => now()])->save();
        $this->timeline->record($shipment->order, 'shipment', __('commerce::orders.timeline.delivered'), ['shipment_id' => $shipment->id], $actor, 'customer');
        DB::afterCommit(fn () => ShipmentDelivered::dispatch($shipment->order, $shipment));

        return $shipment;
    }
}
