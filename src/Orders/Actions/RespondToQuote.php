<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\QuoteSent;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Staff price a quote request (ARCHITECTURE.md §12.4): lines, unit
 * prices, shipping and discount, and how long it is valid. Sending it
 * makes it Quoted and emails the customer the quote page.
 */
class RespondToQuote
{
    public function __construct(protected StaffPricing $pricing, protected OrderStateMachine $states, protected Timeline $timeline) {}

    /**
     * @param  array<int, array{variant_id: int|string, quantity: int|string, unit_price?: int|string|null, item_id?: int|string|null, frozen?: int, frozen_source?: string}>  $lines
     * @param  array{label: string, cost: int}|null  $shipping
     * @param  array{label: string, amount: int}|null  $discount
     *
     * @throws ValidationException
     */
    public function handle(Order $quote, array $lines, ?array $shipping, ?array $discount, ?Carbon $validUntil, Actor $actor, mixed $staff, bool $send = true): Order
    {
        if (! $quote->isQuote() || ! in_array($quote->status, [OrderStatus::REQUESTED, OrderStatus::QUOTED], true)) {
            throw ValidationException::withMessages(['lines' => 'Only open quote requests can be priced.']);
        }
        $items = $quote->items()->whereNull('parent_id')->get()->keyBy('id');
        foreach ($lines as &$line) {
            $item = isset($line['item_id']) ? $items->get((int) $line['item_id']) : null;
            if ($item !== null && ! isset($line['unit_price'])) {
                $line['variant_id'] = (int) $item->variant_id;
                $line['frozen'] = $item->unit_price;
                $line['frozen_source'] = $item->price_source['type'] ?? 'base';
            }
        }
        unset($line);
        $state = $this->pricing->calculate($lines, $quote->customer?->user(), $quote->shipping_address, array_filter(['shipping' => $shipping, 'discount' => $discount]),
            $staff, channel: 'quote', email: $quote->email, pricesAllowed: true, billing: $quote->billing_address);
        if ($state->isEmpty()) {
            throw ValidationException::withMessages(['lines' => 'A quote needs at least one product.']);
        }
        $validUntil ??= now()->addDays((int) app(StoreSettings::class)->get('checkout.quote_valid_days', 14))->endOfDay();

        DB::transaction(function () use ($quote, $state, $validUntil, $actor, $send): void {
            $quote->adjustments()->delete();
            OrderItem::query()->where('order_id', $quote->id)->whereNotNull('parent_id')->delete();
            OrderItem::query()->where('order_id', $quote->id)->delete();
            app(PlaceOrder::class)->insertLines($quote, $state);
            app(PlaceOrder::class)->insertAdjustments($quote, $state);
            $quote->forceFill([
                'subtotal' => $state->totals['subtotal'],
                'discount_total' => $state->totals['discount'] + $state->totals['shipping_discount'],
                'shipping_total' => $state->totals['shipping'],
                'shipping_method' => $state->shipping['rate'] ?? $quote->shipping_method,
                'fee_total' => $state->totals['fee'],
                'tax_total' => $state->totals['tax'],
                'total' => $state->totals['total'],
                'fulfillment_status' => $state->shipping['needed'] ? OrderStatus::UNFULFILLED : OrderStatus::NOT_REQUIRED,
                'quote_valid_until' => $validUntil,
                'version' => $quote->version + 1,
            ])->save();
            if ($send && $quote->status === OrderStatus::REQUESTED) {
                $this->states->transition($quote, OrderStatus::QUOTED, $actor);
            }
            if ($send) {
                $this->timeline->record($quote, 'email', __('commerce::orders.timeline.quote_sent'), [], $actor, 'customer');
            }
        });
        if ($send) {
            DB::afterCommit(fn () => QuoteSent::dispatch($quote->fresh() ?? $quote));
        }

        return $quote->refresh();
    }
}
