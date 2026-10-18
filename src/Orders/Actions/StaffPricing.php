<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders\Actions;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Validation\ValidationException;
use Sunrice\Commerce\Catalog\Models\Variant;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Calculator;
use Sunrice\Commerce\Pricing\PricingContext;

/**
 * The calculation behind manual orders, edits and quotes: staff lines
 * (with optional unit prices), a hand-set shipping cost and discount, in
 * the admin channel. Price overrides need commerce.orders.override-prices
 * (quotes are priced by whoever may respond to them).
 */
class StaffPricing
{
    /**
     * @param  array<int, array{variant_id: int|string, quantity: int|string, unit_price?: int|string|null, item_id?: int|string|null, frozen?: int, frozen_source?: string}>  $lines
     * @param  array{shipping?: array{label: string, cost: int}, discount?: array{label: string, amount: int}}  $overrides
     * @param  array<string, mixed>|null  $destination
     * @param  array<string, mixed>|null  $billing
     *
     * @throws ValidationException
     */
    public function calculate(array $lines, ?Authenticatable $customer, ?array $destination, array $overrides, mixed $staff, string $channel = 'admin', ?string $email = null, bool $pricesAllowed = false, ?array $billing = null): CalculationState
    {
        $calc = [];
        $variants = Variant::withTrashed()->with('product')->whereIn('id', array_column($lines, 'variant_id'))->get()->keyBy('id');
        foreach (array_values($lines) as $i => $line) {
            $variant = $variants->get((int) $line['variant_id']);
            if ($variant === null || (int) $line['quantity'] <= 0) {
                continue;
            }
            $meta = array_filter(['item_id' => $line['item_id'] ?? null]);
            if (isset($line['unit_price']) && $line['unit_price'] !== '') {
                $meta['unit_price'] = (int) $line['unit_price'];
                $meta['price_source'] = 'manual';
                $meta['override'] = true;
            } elseif (isset($line['frozen'])) {
                $meta['unit_price'] = (int) $line['frozen'];
                $meta['price_source'] = $line['frozen_source'] ?? 'manual';
            }
            $calc['l'.($i + 1)] = [$variant, (int) $line['quantity'], $meta];
        }
        $ctx = PricingContext::for($customer, $channel)->with(array_filter([
            'destination' => $destination, 'billingAddress' => $billing, 'overrides' => $overrides, 'email' => $email,
        ], fn ($v) => $v !== null && $v !== []));
        $state = app(Calculator::class)->calculate($calc, $ctx);

        // Overrides that change a price need the permission.
        $overridden = array_filter($state->lines, fn ($l) => ($l->meta['override'] ?? false));
        if ($overridden !== [] && ! $pricesAllowed && ! ($staff?->can('commerce.orders.override-prices') ?? false)) {
            $plain = app(Calculator::class)->calculate(array_map(fn ($row) => [$row[0], $row[1], array_diff_key($row[2], array_flip(['unit_price', 'price_source', 'override']))], $calc), $ctx);
            foreach ($overridden as $key => $line) {
                if (($plain->lines[$key]->unitPrice ?? null) !== $line->unitPrice) {
                    throw ValidationException::withMessages(['lines' => 'You may not change prices.']);
                }
            }
        }

        return $state;
    }
}
