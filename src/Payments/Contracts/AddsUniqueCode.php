<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

/**
 * A method that makes each open order's amount unique (bank transfer), so
 * staff can tell transfers apart: PlaceOrder adds the code as a
 * `unique_code` adjustment.
 */
interface AddsUniqueCode
{
    /** @return array{min: int, max: int, direction: 'add'|'subtract'}|null null when off */
    public function uniqueCodeRange(): ?array;
}
