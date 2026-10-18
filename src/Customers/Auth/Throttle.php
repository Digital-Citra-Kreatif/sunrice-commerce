<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/** Sign-in throttles keyed by email + IP and by IP (like Sunrice's admin login). */
final class Throttle
{
    /** @throws ValidationException when too many attempts */
    public static function check(string $name, Request $request, string $email, int $perEmail, int $perIp, int $decaySeconds = 60, string $field = 'email'): void
    {
        foreach (self::keys($name, $request, $email) as $i => $key) {
            if (RateLimiter::tooManyAttempts($key, $i === 0 ? $perEmail : $perIp)) {
                throw ValidationException::withMessages([$field => __('commerce::account.throttled', ['seconds' => RateLimiter::availableIn($key)])]);
            }
        }
    }

    public static function hit(string $name, Request $request, string $email, int $decaySeconds = 60): void
    {
        foreach (self::keys($name, $request, $email) as $key) {
            RateLimiter::hit($key, $decaySeconds);
        }
    }

    public static function clear(string $name, Request $request, string $email): void
    {
        RateLimiter::clear(self::keys($name, $request, $email)[0]);
    }

    /** @return array{0: string, 1: string} */
    protected static function keys(string $name, Request $request, string $email): array
    {
        return ["{$name}:".Str::transliterate(Str::lower($email)).'|'.$request->ip(), "{$name}:ip:".$request->ip()];
    }
}
