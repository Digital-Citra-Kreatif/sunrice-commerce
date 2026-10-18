<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Taxes;

use Sunrice\Commerce\Contracts\TaxCalculator;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Prices as the store shows them (Settings → Store → Taxes → Show prices):
 * entered including tax but shown excluding it (or the other way round),
 * a price is converted with the rates of its tax class. Catalog prices use
 * the store address (the visitor's isn't known yet); cart lines use the
 * tax the calculator worked out for them. Totals are never converted.
 */
class TaxDisplay
{
    public function __construct(protected StoreSettings $settings, protected Features $features) {}

    /** +1 adds tax to shown prices, -1 takes it out, 0 shows them as entered. */
    public function direction(): int
    {
        if (! $this->features->active('taxes')) {
            return 0;
        }
        $inclusive = (bool) $this->settings->get('taxes.prices_include_tax', true);

        return match ($this->settings->get('taxes.display_prices', 'incl')) {
            'excl' => $inclusive ? -1 : 0,
            'incl' => $inclusive ? 0 : 1,
            default => 0,
        };
    }

    /** A catalog price, shown. */
    public function price(int $amount, ?string $taxClass = null): int
    {
        $direction = $this->direction();
        /** @var TaxCalculator $calculator */
        $calculator = app(TaxCalculator::class);
        if ($direction === 0 || $amount <= 0 || ! $calculator instanceof TableRateTaxCalculator) {
            return $amount;
        }

        return $amount + $direction * $calculator->taxOn($amount, $taxClass ?? 'standard', $direction < 0);
    }

    /** An amount of a cart line (its unit price or total), shown. */
    public function line(CalcLine $line, int $amount): int
    {
        $direction = $this->direction();
        $net = $line->net();
        if ($direction === 0 || $net <= 0 || $amount <= 0) {
            return $amount;
        }

        return (int) round($amount * ($net + $direction * $line->tax()) / $net);
    }
}
