<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use LogicException;
use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/**
 * Sums everything. Discounts never exceed what they apply to and the
 * total never goes below zero. Taxes added on top (exclusive prices) are
 * in `tax_added`; inclusive taxes are only reported.
 */
class Totals implements CalculationStage
{
    public function run(CalculationState $state): void
    {
        $subtotal = 0;
        $discount = 0;
        foreach ($state->lines as $line) {
            // A line can't be discounted below zero.
            $over = $line->discount() - $line->subtotal;
            if ($over > 0) {
                foreach (array_reverse($line->discounts, true) as $key => $amount) {
                    $cut = min($amount, $over);
                    $line->discounts[$key] -= $cut;
                    $state->adjustments[$key]->amount -= $cut;
                    $state->adjustments[$key]->allocations[$line->key] = ($state->adjustments[$key]->allocations[$line->key] ?? 0) - $cut;
                    $over -= $cut;
                    if ($over <= 0) {
                        break;
                    }
                }
            }
            $subtotal += $line->subtotal;
            $discount += $line->discount();
        }
        $orderDiscount = array_sum(array_map(fn (Adjustment $a) => $a->amount, $state->adjustmentsOfType(Adjustment::DISCOUNT)));
        if ($orderDiscount !== $discount) {
            throw new LogicException("Discount allocations ({$discount}) don't sum to the discounts ({$orderDiscount}).");
        }

        $shipping = $state->shipping['cost'];
        $shippingDiscount = min($shipping, array_sum(array_map(fn (Adjustment $a) => $a->amount, $state->adjustmentsOfType(Adjustment::SHIPPING_DISCOUNT))));
        $fee = array_sum(array_map(fn (Adjustment $a) => $a->amount, [...$state->adjustmentsOfType(Adjustment::FEE), ...$state->adjustmentsOfType(Adjustment::UNIQUE_CODE)]));
        $tax = array_sum(array_map(fn ($line) => $line->tax(), $state->lines)) + (int) ($state->data['shipping_tax'] ?? 0);
        $taxAdded = (int) ($state->data['tax_added'] ?? 0);

        $state->totals = [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'shipping_discount' => $shippingDiscount,
            'fee' => $fee,
            'tax' => $tax,
            'total' => max(0, $subtotal - $discount + $shipping - $shippingDiscount + $fee + $taxAdded),
        ];
    }
}
