<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Stages;

use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\CalculationStage;

/**
 * Unit prices set by staff (line meta `unit_price`): an override on a
 * manual order or quote, or the price an existing line keeps when an
 * unpaid order is edited ("frozen"). Only for staff channels.
 */
class StaffPrices implements CalculationStage
{
    public function run(CalculationState $state): void
    {
        if (! $state->ctx->isStaff()) {
            return;
        }
        foreach ($state->lines as $line) {
            if (! isset($line->meta['unit_price']) || ! is_numeric($line->meta['unit_price'])) {
                continue;
            }
            $price = max(0, (int) $line->meta['unit_price']);
            $line->regularUnitPrice = max($line->regularUnitPrice, $price);
            $line->unitPrice = $price;
            $line->priceSource = ['type' => (string) ($line->meta['price_source'] ?? 'manual')];
            $line->onSale = false;
        }
    }
}
