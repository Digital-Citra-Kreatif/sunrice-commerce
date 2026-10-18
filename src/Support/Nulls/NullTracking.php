<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Support\Nulls;

use Sunrice\Commerce\Contracts\Tracking;

class NullTracking implements Tracking
{
    public function track(string $event, ?int $productId = null, array $meta = []): void {}
}
