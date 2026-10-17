<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;
use Sunrice\Commerce\Support\Allocator;

/** A discount staff set on a manual order, an edit or a quote, spread over the lines. */
class StaffDiscount implements CalculationStage
{
    public function run(CalculationState $state): void
    {
        $discount = $state->ctx->overrides['discount'] ?? null;
        if (! $state->ctx->isStaff() || $discount === null || $state->isEmpty()) {
            return;
        }
        $left = array_map(fn (CalcLine $l) => $l->net(), $state->lines);
        $amount = min(max(0, (int) $discount['amount']), array_sum($left));
        if ($amount <= 0) {
            return;
        }
        $state->addAdjustment(new Adjustment('manual', Adjustment::DISCOUNT, (string) ($discount['label'] ?: __('commerce::checkout.manual_discount')), $amount,
            ['type' => 'manual'], Allocator::proportional($amount, $left)));
    }
}
