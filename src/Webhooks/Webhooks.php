<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Webhooks;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Mcp\OrderData;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\Shipment;
use Sunrice\Commerce\Webhooks\Jobs\DeliverWebhook;
use Sunrice\Commerce\Webhooks\Models\Webhook;

/**
 * Outgoing webhooks (docs/webhooks.md): each event goes, as one JSON body,
 * to every active endpoint that listens to it. A delivery is recorded with
 * the event and sent by a queued job once the transaction that caused it
 * commits, so a rolled-back change sends nothing.
 */
class Webhooks
{
    /** event => what staff see when choosing events */
    public const EVENTS = [
        'order.placed' => 'Order placed',
        'order.paid' => 'Order paid',
        'order.status_changed' => 'Order status changed',
        'order.cancelled' => 'Order cancelled',
        'order.completed' => 'Order completed',
        'order.refunded' => 'Order refunded',
        'shipment.created' => 'Shipment created',
        'shipment.delivered' => 'Shipment delivered',
        'stock.low' => 'Stock low',
        'stock.out' => 'Out of stock',
        'stock.back_in' => 'Back in stock',
    ];

    /** @var array<int, Webhook>|null this request's active endpoints, loaded once */
    protected ?array $endpoints = null;

    /**
     * Records the event for every endpoint that listens to it and queues the deliveries.
     *
     * @param  array<string, mixed>  $data
     * @return int deliveries queued
     */
    public function send(string $event, array $data): int
    {
        $endpoints = array_filter($this->endpoints(), fn (Webhook $w) => $w->listensTo($event));
        if ($endpoints === []) {
            return 0;
        }
        $ids = [];
        foreach ($endpoints as $webhook) {
            $delivery = $webhook->deliveries()->create([
                'uuid' => (string) Str::uuid(),
                'event' => $event,
                'payload' => ['event' => $event, 'created_at' => now()->toIso8601String(), 'data' => $data],
            ]);
            $ids[] = $delivery->id;
        }
        DB::afterCommit(function () use ($ids): void {
            foreach ($ids as $id) {
                DeliverWebhook::dispatch($id);
            }
        });

        return count($ids);
    }

    /** Whether an active endpoint listens to the event (so its body is worth building). */
    public function wanted(string $event): bool
    {
        foreach ($this->endpoints() as $webhook) {
            if ($webhook->listensTo($event)) {
                return true;
            }
        }

        return false;
    }

    /** Forgets the endpoints loaded for this request (after staff change one). */
    public function flush(): void
    {
        $this->endpoints = null;
    }

    /** @return array<int, Webhook> */
    protected function endpoints(): array
    {
        return $this->endpoints ??= Webhook::query()->where('active', true)->get()->all();
    }

    /** @return array<string, mixed> */
    public static function order(Order $order): array
    {
        return ['order' => Arr::except(OrderData::detail($order), ['timeline', 'next_statuses'])];
    }

    /** @return array<string, mixed> */
    public static function shipment(Order $order, Shipment $shipment): array
    {
        return [
            'shipment' => [
                'id' => $shipment->id, 'courier' => $shipment->courier_name ?? $shipment->courier, 'service' => $shipment->service,
                'tracking_number' => $shipment->tracking_number, 'status' => $shipment->status,
                'shipped_at' => $shipment->shipped_at?->toIso8601String(), 'delivered_at' => $shipment->delivered_at?->toIso8601String(),
            ],
            ...self::order($order),
        ];
    }

    /** @return array<string, mixed> */
    public static function variant(Variant $variant, ?int $before, ?int $after): array
    {
        $translations = $variant->product->entry()?->translations;

        return ['variant' => [
            'id' => $variant->id, 'product_id' => $variant->product_id, 'sku' => $variant->sku, 'title' => $variant->title,
            'product' => $translations?->firstWhere('locale', Locales::default())->title ?? $translations?->first()->title,
            'stock_status' => $variant->stock_status, 'stock_before' => $before, 'stock' => $after ?? $variant->stock_quantity,
        ]];
    }

    /**
     * The signature header's value for a body: `t=<unix time>,v1=<hex HMAC-SHA256 of "<time>.<body>">`.
     */
    public static function signature(string $secret, int $timestamp, string $body): string
    {
        return 't='.$timestamp.',v1='.hash_hmac('sha256', $timestamp.'.'.$body, $secret);
    }

    public static function newSecret(): string
    {
        return 'whsec_'.Str::random(40);
    }
}
