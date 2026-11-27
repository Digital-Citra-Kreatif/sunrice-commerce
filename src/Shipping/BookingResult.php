<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Shipping;

/** A carrier booking: the tracking number and anything else it returned. */
final class BookingResult
{
    /** @param  array<string, mixed>  $meta */
    public function __construct(public readonly string $trackingNumber, public readonly ?string $trackingUrl = null, public readonly array $meta = []) {}
}
