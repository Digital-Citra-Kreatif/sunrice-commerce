<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks\Listeners;

use Sunrice\Commerce\Inventory\Events\StockBackIn;
use Sunrice\Commerce\Inventory\Events\StockLow;
use Sunrice\Commerce\Inventory\Events\StockOut;
use Sunrice\Commerce\Orders\Events\OrderCancelled;
use Sunrice\Commerce\Orders\Events\OrderCompleted;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Events\OrderRefunded;
use Sunrice\Commerce\Orders\Events\OrderStatusChanged;
use Sunrice\Commerce\Orders\Events\ShipmentCreated;
use Sunrice\Commerce\Orders\Events\ShipmentDelivered;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\Refund;
use Sunrice\Commerce\Payments\Events\PaymentRecorded;
use Sunrice\Commerce\Webhooks\Webhooks;

/** Turns the store's events into webhook deliveries (Webhooks::EVENTS). */
class SendWebhooks
{
    /** @var array<class-string, string> */
    public const MAP = [
        OrderPlaced::class => 'order.placed',
        OrderPaid::class => 'order.paid',
        OrderStatusChanged::class => 'order.status_changed',
        OrderCancelled::class => 'order.cancelled',
        OrderCompleted::class => 'order.completed',
        OrderRefunded::class => 'order.refunded',
        PaymentRecorded::class => 'order.refunded',
        ShipmentCreated::class => 'shipment.created',
        ShipmentDelivered::class => 'shipment.delivered',
        StockLow::class => 'stock.low',
        StockOut::class => 'stock.out',
        StockBackIn::class => 'stock.back_in',
    ];

    public function __construct(protected Webhooks $webhooks) {}

    public function handle(object $event): void
    {
        if (! commerce_feature('webhooks')) {
            return;
        }
        $name = self::MAP[$event::class] ?? null;
        if ($name === null || ! $this->webhooks->wanted($name)) {
            return;
        }
        $data = match (true) {
            $event instanceof PaymentRecorded => $this->reportedRefund($event),
            $event instanceof StockLow, $event instanceof StockOut, $event instanceof StockBackIn => Webhooks::variant($event->variant, $event->before, $event->after),
            $event instanceof ShipmentCreated, $event instanceof ShipmentDelivered => Webhooks::shipment($event->order, $event->shipment),
            $event instanceof OrderStatusChanged => [...Webhooks::order($event->order), 'from' => $event->from, 'to' => $event->to],
            $event instanceof OrderRefunded => [...Webhooks::order($event->order), 'refund' => ['amount' => $event->refund->amount, 'reason' => $event->refund->reason]],
            property_exists($event, 'order') && $event->order instanceof Order => Webhooks::order($event->order),
            default => null,
        };
        if ($data !== null) {
            $this->webhooks->send($name, $data);
        }
    }

    /**
     * A refund the payment provider reported (its webhook). Refunds staff record
     * dispatch OrderRefunded and also pass through here, with their refund's
     * reference: those are left to OrderRefunded, so each refund is sent once.
     *
     * @return array<string, mixed>|null
     */
    protected function reportedRefund(PaymentRecorded $event): ?array
    {
        $reference = (string) $event->result->reference;
        if (! in_array($event->result->status, ['refunded', 'partially_refunded'], true) || str_starts_with($reference, 'refund:')
            || Refund::query()->where('order_id', $event->payment->order_id)->where('reference', $reference)->exists()) {
            return null;
        }
        $order = Order::withTrashed()->find($event->payment->order_id);

        return $order !== null ? [...Webhooks::order($order), 'refund' => ['amount' => $event->result->amount, 'reason' => null]] : null;
    }
}
