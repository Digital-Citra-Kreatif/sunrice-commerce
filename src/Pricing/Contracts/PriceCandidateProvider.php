<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing\Contracts;

use Sunrice\Commerce\Pricing\CalcLine;
use Sunrice\Commerce\Pricing\CalculationState;
use Sunrice\Commerce\Pricing\PriceCandidate;

/** Offers unit prices for a line (the lowest of all providers wins; ties keep the earlier provider). */
interface PriceCandidateProvider
{
    /** @return iterable<PriceCandidate> */
    public function candidates(CalcLine $line, CalculationState $state): iterable;
}
