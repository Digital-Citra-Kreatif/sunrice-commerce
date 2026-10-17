<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;

/** Applies a checked voucher to a calculation (shared by codes and automatic discounts). */
class VoucherDiscounts
{
    public function __construct(protected VoucherEligibility $eligibility, protected VoucherAmounts $amounts) {}

    /** @return array<int, Voucher> */
    public static function applied(CalculationState $state): array
    {
        return $state->data['vouchers'] ?? [];
    }

    /** Tries the voucher; returns the eligibility result (applied when ok). */
    public function apply(Voucher $voucher, CalculationState $state): Eligibility
    {
        $result = $this->eligibility->check($voucher, $state, static::applied($state));
        if (! $result->ok()) {
            return $result;
        }
        $state->data['vouchers'][] = $voucher;
        if ($voucher->code !== null) {
            $state->appliedCodes[] = $voucher->code;
        }
        if ($result->pending !== []) {
            $state->notice('voucher_conditional', __('commerce::validation.voucher.conditional', [
                'code' => $voucher->label(),
                'conditions' => implode(', ', array_map(fn (string $p) => __('commerce::validation.voucher.condition_'.$p), $result->pending)),
            ]), voucher: $voucher->label());
        }
        if ($voucher->type === 'free_shipping') {
            $state->data['free_shipping'][] = $voucher;

            return $result;
        }
        $allocations = $this->amounts->allocations($voucher, $state, $result->lines);
        if ($allocations !== []) {
            $state->addAdjustment(new Adjustment('voucher:'.$voucher->id, Adjustment::DISCOUNT, $voucher->name ?: (string) $voucher->code, array_sum($allocations),
                ['type' => 'voucher', 'id' => $voucher->id, 'code' => $voucher->code], $allocations, ['automatic' => $voucher->automatic]));
        }

        return $result;
    }
}
