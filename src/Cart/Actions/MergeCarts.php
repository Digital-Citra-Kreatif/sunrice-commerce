<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Cart\Actions;

use Illuminate\Support\Facades\DB;
use Sunrice\Commerce\Cart\Events\CartMerged;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Catalog\Catalog;
use Sunrice\Commerce\Customers\Models\Customer;

/**
 * At sign-in: the guest cart's lines move into the customer's active cart
 * (quantities added, clamped to what can be bought); the guest cart is
 * marked merged. Without a customer cart, the guest cart becomes theirs.
 * New lines stop at commerce.cart.max_lines; quantities still add up.
 */
class MergeCarts
{
    public function __construct(protected Catalog $catalog) {}

    public function handle(Cart $guest, Customer $customer): Cart
    {
        $target = Cart::query()->where('customer_id', $customer->id)->where('status', 'active')->whereKeyNot($guest->id)->latest('id')->first();
        if ($target === null) {
            $guest->forceFill(['customer_id' => $customer->id])->save();

            return $guest;
        }

        DB::transaction(function () use ($guest, $target): void {
            $max = (int) config('commerce.cart.max_lines', 100);
            $lines = $target->items()->count();
            foreach ($guest->items()->with('variant.product')->get() as $item) {
                $existing = $target->items()->where('variant_id', $item->variant_id)->first();
                if ($existing === null && $max > 0 && $lines >= $max) {
                    continue;
                }
                $quantity = ($existing->quantity ?? 0) + $item->quantity;
                $variant = $item->variant;
                if ($variant->max_qty !== null) {
                    $quantity = min($quantity, $variant->max_qty);
                }
                $availability = $this->catalog->check($variant, $quantity);
                if (! $availability->isOk() && ($availability->details['available'] ?? 0) >= $variant->min_qty) {
                    $quantity = (int) $availability->details['available'];
                }
                if ($existing !== null) {
                    $existing->forceFill(['quantity' => $quantity])->save();
                } else {
                    $target->items()->create(['variant_id' => $item->variant_id, 'quantity' => $quantity, 'unit_price_seen' => $item->unit_price_seen, 'meta' => $item->meta]);
                    $lines++;
                }
            }
            $target->vouchers = array_values(array_unique([...(array) $target->vouchers, ...(array) $guest->vouchers]));
            $target->checkout = array_replace((array) $guest->checkout, (array) $target->checkout);
            $target->last_activity_at = now();
            $target->save();
            $guest->forceFill(['status' => 'merged'])->save();
        });
        CartMerged::dispatch($guest, $target);

        return $target;
    }
}
