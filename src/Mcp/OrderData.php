<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Mcp;

use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderEvent;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\Models\Refund;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Compact order JSON for the MCP tools: money as integers plus a formatted string. */
final class OrderData
{
    /** @return array{amount: int, formatted: string} */
    public static function money(int $amount): array
    {
        return ['amount' => $amount, 'formatted' => app(MoneyFormatter::class)->format($amount)];
    }

    /** @return array<string, mixed> */
    public static function summary(Order $order): array
    {
        return [
            'id' => $order->id, 'number' => $order->displayNumber(), 'type' => $order->type,
            'status' => $order->status, 'payment_status' => $order->payment_status, 'fulfillment_status' => $order->fulfillment_status,
            'customer' => $order->customer_name, 'email' => $order->email, 'total' => self::money($order->total),
            'placed_at' => ($order->placed_at ?? $order->created_at)?->toIso8601String(),
        ];
    }

    /** @return array<string, mixed> */
    public static function detail(Order $order): array
    {
        $order->loadMissing(['items', 'shipments', 'refunds', 'events' => fn ($q) => $q->latest('id')->limit(20)]);
        $states = app(OrderStateMachine::class);
        $targets = $order->isQuote() ? OrderStatus::QUOTE_STATUSES : OrderStatus::ORDER_STATUSES;

        return [
            ...self::summary($order),
            'phone' => $order->phone,
            'channel' => $order->channel,
            'items' => $order->items->whereNull('parent_id')->values()->map(fn (OrderItem $i) => [
                'id' => $i->id, 'name' => $i->name, 'variant' => $i->variant_title, 'sku' => $i->sku, 'quantity' => $i->quantity,
                'unit_price' => self::money($i->unit_price), 'total' => self::money($i->total),
                'fulfilled_quantity' => $i->fulfilled_quantity, 'refunded_quantity' => $i->refunded_quantity,
            ])->all(),
            'subtotal' => self::money($order->subtotal), 'discount' => self::money($order->discount_total), 'shipping' => self::money($order->shipping_total),
            'fees' => self::money($order->fee_total), 'tax' => self::money($order->tax_total),
            'paid' => self::money($order->paid_total), 'refunded' => self::money($order->refunded_total),
            'shipping_method' => $order->shipping_method['label'] ?? null,
            'payment_method' => $order->payment_method_title ?? $order->payment_method,
            'shipping_address' => $order->shipping_address, 'billing_address' => $order->billing_address,
            'customer_note' => $order->customer_note,
            'shipments' => $order->shipments->map(fn (Shipment $s) => [
                'id' => $s->id, 'courier' => $s->courier_name ?? $s->courier, 'tracking_number' => $s->tracking_number, 'status' => $s->status,
                'shipped_at' => $s->shipped_at?->toIso8601String(),
            ])->all(),
            'refunds' => $order->refunds->map(fn (Refund $r) => ['amount' => self::money($r->amount), 'reason' => $r->reason, 'at' => $r->created_at?->toIso8601String()])->all(),
            'timeline' => $order->events->map(fn (OrderEvent $e) => ['at' => $e->created_at?->toIso8601String(), 'type' => $e->type, 'message' => $e->message])->all(),
            // What update_order can move it to now.
            'next_statuses' => array_values(array_filter($targets, fn (string $to) => $to !== $order->status && $states->can($order, $to))),
        ];
    }
}
