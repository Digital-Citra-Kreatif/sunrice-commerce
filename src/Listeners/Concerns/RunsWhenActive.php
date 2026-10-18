<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Listeners\Concerns;

use Sunrice\Commerce\Features\Features;

/**
 * For listeners of a module: `if (! $this->active()) return;` at the top
 * of handle(), with `protected string $feature = 'vouchers';`.
 */
trait RunsWhenActive
{
    protected function active(): bool
    {
        return app(Features::class)->active($this->feature);
    }
}
