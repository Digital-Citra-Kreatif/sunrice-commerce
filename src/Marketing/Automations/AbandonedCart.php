<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Carbon\CarbonInterface;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Marketing\Consent;
use Sunrice\Commerce\Marketing\Recipient;
use Sunrice\Support\Locales;

/**
 * A cart with products left alone for N hours, by a customer who accepts
 * marketing, or a guest who gave an email at checkout and ticked "send me
 * news and offers". One email per cart.
 */
class AbandonedCart implements Trigger
{
    public function key(): string
    {
        return 'abandoned_cart';
    }

    public function label(): string
    {
        return 'Abandoned cart';
    }

    public function description(): string
    {
        return 'Products left in the cart without ordering.';
    }

    public function delay(): array
    {
        return ['unit' => 'hours', 'label' => 'Hours after the cart was last changed', 'default' => 3];
    }

    public function template(): string
    {
        return 'abandoned_cart';
    }

    public function recipients(int $delay, CarbonInterface $from, CarbonInterface $to): iterable
    {
        $carts = Cart::query()->where('status', 'active')
            ->where('last_activity_at', '>', $from->copy()->subHours($delay))
            ->where('last_activity_at', '<=', $to->copy()->subHours($delay))
            ->whereHas('items')
            ->with('customer')->orderBy('id');
        foreach ($carts->lazyById(200) as $cart) {
            $checkout = (array) $cart->checkout;
            $customer = $cart->customer;
            $email = $customer->email ?? (is_string($checkout['email'] ?? null) ? mb_strtolower(trim($checkout['email'])) : null);
            if ($email === null || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }
            $customer ??= Customer::query()->where('email', $email)->first();
            $ticked = (bool) filter_var($checkout['accepts_marketing'] ?? false, FILTER_VALIDATE_BOOLEAN);
            if (! Consent::allows($customer, $ticked)) {
                continue;
            }
            yield new Recipient($customer, $email, (string) ($cart->locale ?? $customer->locale ?? Locales::main()), 'cart:'.$cart->id, ['cart_id' => $cart->id, 'ticked' => $ticked]);
        }
    }
}
