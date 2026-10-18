<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Contracts;

/** Counts storefront events for analytics (views, call-to-action clicks…). No personal data. */
interface Tracking
{
    /** @param  array<string, mixed>  $meta */
    public function track(string $event, ?int $productId = null, array $meta = []): void;
}
