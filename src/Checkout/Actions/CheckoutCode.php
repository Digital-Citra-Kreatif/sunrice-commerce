<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout\Actions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Sunrice\Commerce\Checkout\Notifications\CheckoutCodeNotification;
use Throwable;

class CheckoutCode
{
    private const SESSION_KEY = 'checkout_access.challenge';

    public function send(Request $request, string $email): bool
    {
        $recipient = 'checkout-code-mail:'.hash('sha256', $email);
        if (RateLimiter::hit($recipient, 600) > 3) {
            return false;
        }

        $this->forget($request);
        $nonce = Str::random(40);
        $request->session()->put(self::SESSION_KEY, ['nonce' => $nonce, 'email' => $email]);

        $code = (string) random_int(10000000, 99999999);
        $key = $this->key($nonce);
        Cache::put($key, ['email' => $email, 'code' => $this->digest($nonce, $code)], 600);
        $notification = (new CheckoutCodeNotification($code))->locale(app()->getLocale());

        defer(function () use ($email, $key, $notification): void {
            try {
                Notification::route('mail', $email)->notifyNow($notification);
            } catch (Throwable $error) {
                Cache::forget($key);
                report($error);
            }
        });

        return true;
    }

    public function email(Request $request): ?string
    {
        return $request->session()->get(self::SESSION_KEY.'.email');
    }

    public function verify(Request $request, string $code): ?string
    {
        $nonce = $request->session()->get(self::SESSION_KEY.'.nonce');
        if (! is_string($nonce) || RateLimiter::hit($this->key($nonce).':attempt', 600) > 5) {
            return null;
        }

        $key = $this->key($nonce);
        $challenge = Cache::get($key);
        if (! is_array($challenge)
            || ! hash_equals($challenge['code'], $this->digest($nonce, $code))
            || ! Cache::add($key.':used', true, 600)) {
            return null;
        }

        $this->forget($request);

        return $challenge['email'];
    }

    private function forget(Request $request): void
    {
        $challenge = $request->session()->pull(self::SESSION_KEY);
        if (isset($challenge['nonce'])) {
            Cache::forget($this->key($challenge['nonce']));
        }
    }

    private function key(string $nonce): string
    {
        return 'checkout-code:'.$nonce;
    }

    private function digest(string $nonce, string $code): string
    {
        return hash_hmac('sha256', $nonce.':'.$code, (string) config('app.key'));
    }
}
