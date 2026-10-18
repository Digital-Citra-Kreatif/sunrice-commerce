<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Setup;

use Closure;

/** A step of the store dashboard's setup checklist; done() is computed from the store's state. */
final class SetupStep
{
    /** @param  Closure(): bool  $done */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $href,
        public readonly Closure $done,
        public readonly ?string $feature = null,
        public readonly int $position = 100,
        public readonly string $description = '',
    ) {}
}
