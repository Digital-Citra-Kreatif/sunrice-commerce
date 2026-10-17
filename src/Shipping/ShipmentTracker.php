<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

use Sunrice\Commerce\Orders\Actions\UpdateShipment;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Shipping\Contracts\TracksShipments;
use Throwable;

/**
 * Asks the order's shipping method for tracking when it implements
 * TracksShipments (a courier extension): the status and history go in the
 * shipment's meta, a delivered parcel is marked delivered. commerce:tick
 * checks open shipments with a tracking number at most once an hour each.
 */
class ShipmentTracker
{
    public const EVERY_MINUTES = 60;

    public function __construct(protected ShippingTypes $types) {}

    public function track(Shipment $shipment): ?TrackingInfo
    {
        $type = $this->types->get((string) ($shipment->order->shipping_method['method'] ?? ''));
        if (! $type instanceof TracksShipments || $shipment->tracking_number === null) {
            return null;
        }
        $info = $type->track($shipment);
        $shipment->forceFill([
            'status' => $info->delivered ? $shipment->status : ($shipment->status === 'shipped' && $info->history !== [] ? 'in_transit' : $shipment->status),
            'meta' => [...(array) $shipment->meta, 'tracking' => ['status' => $info->status, 'history' => $info->history, 'checked_at' => now()->toIso8601String()]],
        ])->save();
        if ($info->delivered) {
            app(UpdateShipment::class)->delivered($shipment, Actor::system());
        }

        return $info;
    }

    /** The tick step: open shipments not checked in the last hour; returns how many were checked. */
    public function __invoke(): int
    {
        $checked = 0;
        $due = Shipment::query()->with('order')->whereIn('status', ['shipped', 'in_transit'])->whereNotNull('tracking_number')
            ->where('shipped_at', '>=', now()->subDays(60))->orderBy('id')->limit(200)->get()
            ->filter(fn (Shipment $s) => ($at = $s->meta['tracking']['checked_at'] ?? null) === null || now()->diffInMinutes($at, true) >= self::EVERY_MINUTES)
            ->take(50);
        foreach ($due as $shipment) {
            try {
                $this->track($shipment) !== null && $checked++;
            } catch (Throwable $e) {
                report($e);
            }
        }

        return $checked;
    }
}
