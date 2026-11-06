<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\GiftCards\GiftCards;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\DiscountProvider;

/** Voucher codes the customer entered, in the order entered; refusals become notices. */
class VoucherDiscountProvider implements DiscountProvider
{
    public function __construct(protected Features $features, protected VoucherDiscounts $discounts) {}

    public function priority(): int
    {
        return 20;
    }

    public function apply(CalculationState $state): void
    {
        // Gift card codes share the box; the GiftCards stage takes them.
        $codes = array_values(array_diff($state->codes, GiftCards::codesIn($state->codes)));
        if ($codes === []) {
            return;
        }
        if (! $this->features->active('vouchers')) {
            foreach ($codes as $code) {
                $state->notice('voucher_invalid', __('commerce::validation.voucher.not_found', ['code' => $code]), voucher: $code);
            }

            return;
        }
        $found = Voucher::query()->with('targets')->where('automatic', false)->whereIn('code', $codes)->get()->keyBy('code');
        foreach ($codes as $code) {
            $voucher = $found->get($code);
            if ($voucher === null) {
                $state->notice('voucher_invalid', __('commerce::validation.voucher.not_found', ['code' => $code]), voucher: $code);

                continue;
            }
            $result = $this->discounts->apply($voucher, $state);
            if (! $result->ok()) {
                $state->notice('voucher_'.$result->reason, $result->message(), voucher: $code);
            }
        }
    }
}
