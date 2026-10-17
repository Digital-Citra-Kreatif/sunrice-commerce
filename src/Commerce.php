<?php

declare(strict_types=1);

namespace Sunrice\Commerce;

/**
 * The Sunrice Commerce registration API. Extension packages call it from
 * their service providers (payment methods, shipping types, features,
 * settings sections…); templates and code read the store through it.
 *
 * See docs/extending.md for every method.
 */
class Commerce
{
    public const VERSION = '1.0.0-dev';

    public function version(): string
    {
        return self::VERSION;
    }
}
