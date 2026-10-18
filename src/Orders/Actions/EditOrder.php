<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Bundles;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Checkout\Actions\PlaceOrder;
use Sunrice\Commerce\Contracts\Inventory;
use Sunrice\Commerce\Inventory\OutOfStock;
use Sunrice\Commerce\Orders\Actor;
use Sunrice\Commerce\Orders\Events\OrderEdited;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\Models\OrderItem;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Orders\Timeline;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * Changes an unpaid order's lines (ARCHITECTURE.md §12.3): existing lines
 * keep their unit price, new lines get today's price, overrides need the
 * permission; the stock difference is reserved or released, the totals
 * and the open payment's amount follow, and the timeline gets the diff.
 */
class EditOrder
{
    public function __construct(protected StaffPricing $pricing, protected Timeline $timeline) {}

    public function editable(Order $order): bool
    {
        return ! $order->isQuote() && $order->paid_total === 0 && $order->isUnpaid() && ! $order->trashed()
            && in_array($order->status, [OrderStatus::PENDING, OrderStatus::ON_HOLD, OrderStatus::PROCESSING, OrderStatus::FAILED], true)
            && $order->fulfillment_status !== OrderStatus::SHIPPED && $order->fulfillment_status !== OrderStatus::PARTIALLY_SHIPPED;
    }

    /**
     * @param  array<int, array{variant_id: int|string, quantity: int|string, unit_price?: int|string|null, item_id?: int|string|null, frozen?: int, frozen_source?: string}>  $lines
     * @param  array{label: string, cost: int}|null  $shipping
     * @param  array{label: string, amount: int}|null  $discount
     *
     * @throws ValidationException
     */
    public function handle(Order $order, array $lines, ?array $shipping, ?array $discount, Actor $actor, mixed $staff, bool $notify = false): Order
    {
        if (! $this->editable($order)) {
            throw ValidationException::withMessages(['lines' => 'Only unpaid orders that haven\'t shipped can be edited.']);
        }
        $existing = $order->items()->whereNull('parent_id')->get()->keyBy('id');
        foreach ($lines as &$line) {
            $item = isset($line['item_id']) ? $existing->get((int) $line['item_id']) : null;
            if ($item !== null && (! isset($line['unit_price']) || $line['unit_price'] === '')) {
                $line['variant_id'] = (int) $item->variant_id;
                $line['frozen'] = $item->unit_price;
                $line['frozen_source'] = $item->price_source['type'] ?? 'base';
            }
        }
        unset($line);
        $shipping ??= $order->shipping_method !== null ? ['label' => (string) ($order->shipping_method['label'] ?? ''), 'cost' => $order->shipping_total] : null;
        $discount ??= ($existingDiscount = (int) -$order->adjustments()->where('kind', 'discount')->sum('amount')) > 0
            ? ['label' => (string) __('commerce::checkout.manual_discount'), 'amount' => $existingDiscount] : null;
        $user = $order->customer?->user();
        $state = $this->pricing->calculate($lines, $user, $order->shipping_address, array_filter(['shipping' => $shipping, 'discount' => $discount]), $staff, email: $order->email, billing: $order->billing_address);
        if ($state->isEmpty()) {
            throw ValidationException::withMessages(['lines' => 'An order needs at least one product.']);
        }

        $changes = [];
        DB::transaction(function () use ($order, $existing, $state, $actor, &$changes): void {
            // Stock: reserve what was added, give back what was removed.
            $before = [];
            foreach ($existing as $item) {
                if ($item->variant_id !== null) {
                    $before[$item->variant_id] = ($before[$item->variant_id] ?? 0) + $item->quantity;
                }
            }
            $after = [];
            foreach ($state->lines as $line) {
                $after[$line->variant->id] = ($after[$line->variant->id] ?? 0) + $line->quantity;
            }
            if ($order->meta('reserved.stock')) {
                // Compared per stocked variant: lines already sold hold what they were
                // sold with (a bundle's own components), new lines what they hold today.
                $held = [];
                $add = function (Variant $variant, int $qty, int $sign) use (&$held): void {
                    $parts = $variant->product->isBundle()
                        ? array_map(fn (array $c) => [$c['variant'], $c['quantity']], app(Bundles::class)->explode($variant->product, $qty))
                        : [[$variant, $qty]];
                    foreach ($parts as [$part, $partQty]) {
                        $held[$part->id] = [$part, ($held[$part->id][1] ?? 0) + $sign * $partQty];
                    }
                };
                foreach ($existing as $item) {
                    foreach ($item->stockLines($item->quantity) as [$variant, $qty]) {
                        $add($variant, $qty, -1);
                    }
                }
                foreach ($state->lines as $line) {
                    $add($line->variant->loadMissing('product'), $line->quantity, 1);
                }
                $more = array_values(array_filter($held, fn (array $h) => $h[1] > 0));
                $less = array_values(array_map(fn (array $h) => [$h[0], -$h[1]], array_filter($held, fn (array $h) => $h[1] < 0)));
                try {
                    if ($more !== []) {
                        app(Inventory::class)->reserve($more, $order, 'order_edit');
                    }
                } catch (OutOfStock $e) {
                    throw ValidationException::withMessages(['lines' => $e->getMessage()]);
                }
                if ($less !== []) {
                    app(Inventory::class)->release($less, $order, 'order_edit');
                }
            }

            $money = app(MoneyFormatter::class);
            $diff = [];
            foreach ($existing as $item) {
                $now = $after[$item->variant_id] ?? 0;
                if ($now !== $item->quantity) {
                    $diff[] = $now === 0 ? "− {$item->title()}" : "{$item->title()}: {$item->quantity} → {$now}";
                }
            }
            foreach ($state->lines as $line) {
                if (! isset($before[$line->variant->id])) {
                    $diff[] = "+ {$line->quantity} × ".($line->variant->sku ?? $line->variant->id);
                }
            }
            $oldTotal = $order->total;

            $order->adjustments()->delete();
            OrderItem::query()->where('order_id', $order->id)->whereNotNull('parent_id')->delete();
            OrderItem::query()->where('order_id', $order->id)->delete();
            app(PlaceOrder::class)->insertLines($order, $state);
            app(PlaceOrder::class)->insertAdjustments($order, $state);
            $order->forceFill([
                'subtotal' => $state->totals['subtotal'],
                'discount_total' => $state->totals['discount'] + $state->totals['shipping_discount'],
                'shipping_total' => $state->totals['shipping'],
                'shipping_method' => $state->shipping['rate'] ?? $order->shipping_method,
                'fee_total' => $state->totals['fee'],
                'tax_total' => $state->totals['tax'],
                'total' => $state->totals['total'],
                'version' => $order->version + 1,
            ])->save();
            $order->payments()->whereIn('status', ['pending', 'failed'])->update(['amount' => $order->total]);
            if ($oldTotal !== $order->total) {
                $diff[] = 'Total: '.$money->format($oldTotal).' → '.$money->format($order->total);
            }
            $this->timeline->record($order, 'edit', __('commerce::orders.timeline.edited').($diff !== [] ? "\n".implode("\n", $diff) : ''), ['changes' => $diff], $actor);
            $changes = $diff;
        });
        DB::afterCommit(fn () => OrderEdited::dispatch($order, $changes, $notify));

        return $order->refresh();
    }
}
