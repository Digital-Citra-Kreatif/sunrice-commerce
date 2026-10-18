<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Pricing;

/**
 * A possible unit price for a line, with where it comes from
 * (source: type base | flash_sale | price_rule | tier | …, id, label).
 */
final class PriceCandidate
{
    /**
     * @param  array{type: string, id?: int|string|null, label?: string|null}  $source
     * @param  array<string, mixed>  $meta
     */
    public function __construct(
        public readonly int $amount,
        public readonly array $source,
        public readonly array $meta = [],
    ) {}
}
