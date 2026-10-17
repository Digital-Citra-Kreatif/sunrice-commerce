<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Sunrice\Commerce\Orders\Events\OrderNoteAdded;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderEvent;

/** The order timeline: status changes, payments, notes, emails, shipments, edits. */
class Timeline
{
    /** @param  array<string, mixed>  $data */
    public function record(Order $order, string $type, string $message, array $data = [], ?Actor $actor = null, string $visibility = 'internal'): OrderEvent
    {
        $actor ??= Actor::system();

        return OrderEvent::query()->create([
            'order_id' => $order->id,
            'type' => $type,
            'visibility' => $visibility,
            'message' => $message,
            'data' => array_filter([...$data, 'actor' => $actor->name], fn ($v) => $v !== null) ?: null,
            'user_id' => $actor->userId,
            'source' => $actor->source,
            'created_at' => now(),
        ]);
    }

    /** A staff note: internal, or to the customer (emailed). */
    public function note(Order $order, string $message, bool $toCustomer, Actor $actor): OrderEvent
    {
        $event = $this->record($order, 'note', $message, [], $actor, $toCustomer ? 'customer' : 'internal');
        OrderNoteAdded::dispatch($order, $event);

        return $event;
    }
}
