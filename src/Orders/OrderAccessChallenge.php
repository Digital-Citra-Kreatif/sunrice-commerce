<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Sunrice\Commerce\Notifications\GuestOrderCode;
use Sunrice\Commerce\Orders\Models\Order;
use Throwable;

final class OrderAccessChallenge
{
    private const SESSION_KEY = 'commerce.order_access_challenge';

    public function send(Request $request, ?Order $order, bool $confirm): void
    {
        $nonce = Str::random(40);
        $request->session()->put(self::SESSION_KEY, $nonce);
        if ($order === null || $order->user_id !== null || ! filled($order->email)) {
            return;
        }

        $email = (string) $order->email;
        $recipient = 'commerce-order-code-mail:'.hash('sha256', mb_strtolower($email));
        if (RateLimiter::hit($recipient, 600) > 3) {
            return;
        }

        $code = (string) random_int(10000000, 99999999);
        Cache::put($this->key($nonce), [
            'order' => $order->id, 'email' => $email, 'confirm' => $confirm, 'code' => $this->digest($nonce, $code),
        ], now()->addMinutes(10));
        try {
            Notification::route('mail', $email)->notify((new GuestOrderCode($code))->locale(app()->getLocale()));
        } catch (Throwable $error) {
            Cache::forget($this->key($nonce));
            report($error);
        }
    }

    /** @return array{order: Order, confirm: bool}|null */
    public function verify(Request $request, string $code): ?array
    {
        $nonce = $request->session()->get(self::SESSION_KEY);
        if (! is_string($nonce) || RateLimiter::hit($this->key($nonce).':attempt', 600) > 5) {
            return null;
        }

        $key = $this->key($nonce);
        $challenge = Cache::get($key);
        if (! is_array($challenge) || ! hash_equals($challenge['code'], $this->digest($nonce, $code))) {
            return null;
        }

        $order = Order::query()->whereNull('user_id')->where('email', $challenge['email'])->find($challenge['order']);
        if ($order === null || ! Cache::add($key.':used', true, 600)) {
            return null;
        }

        Cache::forget($key);
        $request->session()->forget(self::SESSION_KEY);

        return ['order' => $order, 'confirm' => (bool) $challenge['confirm']];
    }

    private function key(string $nonce): string
    {
        return "commerce-order-code:{$nonce}";
    }

    private function digest(string $nonce, string $code): string
    {
        return hash_hmac('sha256', $nonce.':'.$code, (string) config('app.key'));
    }
}
