<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Promotions\Vouchers;

use Sunrice\Commerce\Pricing\Adjustment;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\ShippingDiscountProvider;

/** Free-shipping vouchers: the shipping cost, capped by the voucher's value when set. */
class FreeShippingProvider implements ShippingDiscountProvider
{
    public function apply(CalculationState $state): void
    {
        $left = $state->shipping['cost'];
        $method = $state->shipping['rate']['method'] ?? null;
        foreach ($state->data['free_shipping'] ?? [] as $voucher) {
            if ($left <= 0) {
                break;
            }
            if (! empty($voucher->shipping_methods) && $method !== null && ! in_array($method, (array) $voucher->shipping_methods, true)) {
                $state->notice('voucher_shipping_method', __('commerce::validation.voucher.shipping_method'), voucher: $voucher->label());

                continue;
            }
            $amount = $voucher->value > 0 ? min($voucher->value, $left) : $left;
            $state->addAdjustment(new Adjustment('voucher:'.$voucher->id, Adjustment::SHIPPING_DISCOUNT, $voucher->name ?: (string) $voucher->code, $amount,
                ['type' => 'voucher', 'id' => $voucher->id, 'code' => $voucher->code]));
            $left -= $amount;
        }
    }
}
