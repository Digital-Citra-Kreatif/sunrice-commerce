<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Returns\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Notifications\Notifier;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Orders\TimelineText;
use Sunrice\Commerce\Returns\Models\ReturnRequest;
use Sunrice\Commerce\Returns\Returns;

/** A customer asks to return items of their order (My Account); staff are emailed. */
class RequestReturn
{
    public function __construct(protected Returns $returns, protected Timeline $timeline, protected Notifier $notifier) {}

    /**
     * @param  array<int|string, int|string|null>  $quantities  order item id => quantity
     *
     * @throws ValidationException
     */
    public function handle(Order $order, array $quantities, string $reason, ?string $details, Actor $actor): ReturnRequest
    {
        // The order row is locked while what's left is counted and the return is written: two requests at once can't both take the last units.
        $return = DB::transaction(function () use ($order, $quantities, $reason, $details): ReturnRequest {
            // Checked on the locked row: a refund or cancellation since the page loaded counts.
            $order = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            if (! $this->returns->open($order)) {
                throw ValidationException::withMessages(['return' => __('commerce::account.returns.closed')]);
            }
            $left = $this->returns->returnable($order);
            $items = [];
            foreach ($quantities as $itemId => $qty) {
                $qty = (int) $qty;
                if ($qty <= 0) {
                    continue;
                }
                if (! isset($left[(int) $itemId]) || $qty > $left[(int) $itemId]) {
                    throw ValidationException::withMessages(['items' => __('commerce::account.returns.too_many')]);
                }
                $items[(int) $itemId] = $qty;
            }
            if ($items === []) {
                throw ValidationException::withMessages(['items' => __('commerce::account.returns.none')]);
            }
            $return = ReturnRequest::query()->create(['order_id' => $order->id, 'customer_id' => $order->customer_id, 'reason' => $reason, 'details' => $details]);
            foreach ($items as $itemId => $qty) {
                $return->items()->create(['order_item_id' => $itemId, 'quantity' => $qty]);
            }

            return $return;
        });
        $this->timeline->record($order, 'return', Timeline::text('commerce::orders.timeline.return_requested', ['number' => $return->number(), 'reason' => TimelineText::make("commerce::account.returns.reasons.{$reason}")]), ['return' => $return->id], $actor, 'customer');
        $this->notifier->send('staff_return_requested', $order, ['url' => route('sunrice.admin.commerce.returns.edit', $return), 'return' => $return->number()]);

        return $return;
    }
}
