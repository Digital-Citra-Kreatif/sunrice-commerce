<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Providers;

use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\Contracts\PriceCandidateProvider;
use Sunrice\Commerce\Pricing\PriceCandidate;

/** The variant's own price (a bundle's from its pricing mode). */
class BasePrice implements PriceCandidateProvider
{
    public function candidates(CalcLine $line, CalculationState $state): iterable
    {
        yield new PriceCandidate($line->basePrice(), ['type' => 'base']);
    }
}
