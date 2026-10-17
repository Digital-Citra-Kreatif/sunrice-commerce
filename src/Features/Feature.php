<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Features;

/**
 * A store module that can be switched on and off (Settings → Store →
 * Features). It is active only when switched on, available in the
 * current selling mode, and every module it requires is active.
 */
final class Feature
{
    public const MODES = ['shop', 'quote', 'whatsapp', 'catalog'];

    /**
     * @param  array<int, string>  $requires  feature keys
     * @param  array<int, string>  $modes  selling modes where it can be active
     * @param  array<string, array<int, string>>  $modeRequires  extra requirements per selling mode
     */
    public function __construct(
        public readonly string $key,
        public readonly string $group,
        public readonly string $label,
        public readonly string $description = '',
        public readonly array $requires = [],
        public readonly array $modes = self::MODES,
        public readonly array $modeRequires = [],
        public readonly bool $default = true,
        public readonly bool $core = false,
    ) {}
}
