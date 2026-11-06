<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Features\Features;
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
        if ($state->codes === []) {
            return;
        }
        if (! $this->features->active('vouchers')) {
            foreach ($state->codes as $code) {
                $state->notice('voucher_invalid', __('commerce::validation.voucher.not_found', ['code' => $code]), voucher: $code);
            }

            return;
        }
        $found = Voucher::query()->with('targets')->where('automatic', false)->whereIn('code', $state->codes)->get()->keyBy('code');
        foreach ($state->codes as $code) {
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
