<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\DiscountProvider;

/** Automatic discounts (vouchers without a code), first, by priority. */
class AutomaticDiscountProvider implements DiscountProvider
{
    public function __construct(protected Features $features, protected VoucherDiscounts $discounts) {}

    public function priority(): int
    {
        return 10;
    }

    public function apply(CalculationState $state): void
    {
        if (! $this->features->active('vouchers')) {
            return;
        }
        $vouchers = Voucher::query()->with('targets')->where('automatic', true)->where('active', true)->orderByDesc('priority')->orderBy('id')->get();
        foreach ($vouchers as $voucher) {
            $this->discounts->apply($voucher, $state);
        }
    }
}
