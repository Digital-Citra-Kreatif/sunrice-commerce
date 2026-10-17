<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Health;

final class HealthResult
{
    public const OK = 'ok';

    public const WARNING = 'warning';

    public const ERROR = 'error';

    public function __construct(
        public readonly string $status,
        public readonly string $message = '',
        public readonly ?string $fix = null,
    ) {}

    public static function ok(string $message = ''): self
    {
        return new self(self::OK, $message);
    }

    public static function warning(string $message, ?string $fix = null): self
    {
        return new self(self::WARNING, $message, $fix);
    }

    public static function error(string $message, ?string $fix = null): self
    {
        return new self(self::ERROR, $message, $fix);
    }
}
