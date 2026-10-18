<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Inventory\OutOfStock;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderPaid;
use Sunrice\Commerce\Orders\Events\OrderPlaced;
use Sunrice\Commerce\Orders\Events\QuoteAccepted;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Numbering;
use Sunrice\Commerce\Orders\OrderStateMachine;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Support\DomainException;

/**
 * The customer accepts a quote: still valid, still available; stock is
 * reserved at the quoted prices, it gets an order number and becomes an
 * order, Pending payment (or Processing when it costs nothing).
 */
class AcceptQuote
{
    public function __construct(protected OrderStateMachine $states, protected Numbering $numbering, protected Timeline $timeline) {}

    /** @throws DomainException */
    public function handle(Order $quote, ?Actor $actor = null): Order
    {
        $actor ??= Actor::customer();
        if (! $quote->isQuote() || $quote->status !== OrderStatus::QUOTED) {
            throw new DomainException(__('commerce::checkout.quote.not_open'));
        }
        if ($quote->quote_valid_until !== null && $quote->quote_valid_until->isPast()) {
            throw new DomainException(__('commerce::checkout.quote.expired'));
        }

        DB::transaction(function () use ($quote, $actor): void {
            $lines = [];
            foreach ($quote->items()->whereNull('parent_id')->get() as $item) {
                $variant = $item->variant_id === null ? null : Variant::query()->with('product')->find($item->variant_id);
                if ($variant === null || $variant->product->removed_at !== null || ! $variant->active) {
                    throw new DomainException(__('commerce::checkout.quote.unavailable', ['product' => $item->title()]));
                }
                $lines[] = [$variant, $item->quantity];
            }
            try {
                app(Inventory::class)->reserve($lines, $quote, 'order');
            } catch (OutOfStock $e) {
                throw new DomainException($e->getMessage());
            }
            $this->states->transition($quote, OrderStatus::ACCEPTED, $actor);
            $free = $quote->total === 0;
            $quote->forceFill([
                'type' => 'order',
                'number' => $this->numbering->next('order', $quote),
                'status' => $free ? OrderStatus::PROCESSING : OrderStatus::PENDING,
                'payment_status' => $free ? OrderStatus::PAID : OrderStatus::UNPAID,
                'paid_at' => $free ? now() : null,
                'placed_at' => now(),
                'version' => $quote->version + 1,
            ])->setMeta('reserved.stock', true)->save();
            $this->timeline->record($quote, 'status', __('commerce::orders.timeline.quote_accepted'), ['to' => $quote->status], $actor);
        });
        DB::afterCommit(function () use ($quote): void {
            QuoteAccepted::dispatch($quote);
            OrderPlaced::dispatch($quote);
            if ($quote->payment_status === OrderStatus::PAID) {
                OrderPaid::dispatch($quote);
            }
        });

        return $quote->refresh();
    }
}
