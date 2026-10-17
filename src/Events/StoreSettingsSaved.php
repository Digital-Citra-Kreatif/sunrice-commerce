<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Events;

use Illuminate\Foundation\Events\Dispatchable;

class StoreSettingsSaved
{
    use Dispatchable;

    /** @param  array<int, string>  $changes  keys that changed */
    public function __construct(public readonly string $section, public readonly array $changes) {}
}
