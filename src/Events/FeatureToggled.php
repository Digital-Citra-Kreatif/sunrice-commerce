<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Events;

use Illuminate\Foundation\Events\Dispatchable;

class FeatureToggled
{
    use Dispatchable;

    /**
     * @param  array<int, string>  $deactivated  modules that became inactive
     * @param  array<int, string>  $activated  modules that became active
     */
    public function __construct(
        public readonly string $feature,
        public readonly bool $on,
        public readonly array $deactivated = [],
        public readonly array $activated = [],
    ) {}
}
