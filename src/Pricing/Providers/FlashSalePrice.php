<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Providers;

use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\PriceCandidateProvider;
use Sunrice\Commerce\Pricing\PriceCandidate;
use Sunrice\Commerce\Promotions\FlashSales\ActiveSales;
use Sunrice\Commerce\Promotions\FlashSales\FlashSaleLimits;

/**
 * The running flash sale price, while the cap has room for the line's
 * quantity and the customer is within the per-customer limit; otherwise
 * nothing (the regular price applies) with a notice.
 */
class FlashSalePrice implements PriceCandidateProvider
{
    public function __construct(protected ActiveSales $sales, protected FlashSaleLimits $limits) {}

    public function candidates(CalcLine $line, CalculationState $state): iterable
    {
        $item = $this->sales->for($line->variant);
        if ($item === null) {
            return;
        }
        $label = $item->sale->name;
        $remaining = $item->remaining();
        if ($remaining !== null && $remaining < $line->quantity) {
            $state->notice('flash_sale_sold_out', __('commerce::storefront.flash.cap', ['count' => $remaining, 'sale' => $label]), $line->key);

            return;
        }
        $customer = $this->limits->customerRemaining($item, $state->ctx);
        if ($customer !== null && $customer < $line->quantity) {
            $state->notice('flash_sale_limit', __('commerce::storefront.flash.limit', ['count' => $customer, 'sale' => $label]), $line->key);

            return;
        }

        yield new PriceCandidate($item->priceFor($line->variant->price), ['type' => 'flash_sale', 'id' => $item->id, 'label' => $label],
            ['flash_sale_id' => $item->flash_sale_id, 'ends_at' => $item->sale->ends_at->toIso8601String()]);
    }
}
