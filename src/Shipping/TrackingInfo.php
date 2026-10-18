<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

/** Where a parcel is, as a carrier reports it. */
final class TrackingInfo
{
    /** @param  array<int, array{at: string, status: string, location?: string|null}>  $history */
    public function __construct(public readonly string $status, public readonly bool $delivered = false, public readonly array $history = []) {}
}
