<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Illuminate\Contracts\Auth\Authenticatable;

/** Who changed an order, for the timeline: staff, the customer, the system, a gateway or AI. */
final class Actor
{
    public const SOURCES = ['admin', 'storefront', 'system', 'ai', 'gateway'];

    public function __construct(
        public readonly string $source = 'system',
        public readonly ?int $userId = null,
        public readonly ?string $name = null,
    ) {}

    public static function admin(?Authenticatable $user = null): self
    {
        $user ??= auth()->guard((string) config('sunrice.auth.guard', 'web'))->user();

        return new self('admin', $user === null ? null : (int) $user->getAuthIdentifier(), $user?->getAttribute('name'));
    }

    public static function customer(?Authenticatable $user = null): self
    {
        $user ??= commerce_customer();

        return new self('storefront', $user === null ? null : (int) $user->getAuthIdentifier(), $user?->getAttribute('name'));
    }

    public static function system(): self
    {
        return new self('system');
    }

    public static function gateway(string $method): self
    {
        return new self('gateway', null, $method);
    }

    public static function ai(?Authenticatable $user = null, ?string $via = null): self
    {
        return new self('ai', $user === null ? null : (int) $user->getAuthIdentifier(), $via ?? $user?->getAttribute('name'));
    }

    public function isStaff(): bool
    {
        return in_array($this->source, ['admin', 'ai'], true);
    }
}
