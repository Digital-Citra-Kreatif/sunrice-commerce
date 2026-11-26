<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Carbon\CarbonInterface;
use Sunrice\Cms\Support\Locales;
use Sunrice\Commerce\Cart\Models\Cart;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Marketing\Consent;
use Sunrice\Commerce\Marketing\Recipient;

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
        // A cart with someone to write to is an account's: a visitor's cart has no address until they sign in.
        $carts = Cart::query()->where('status', 'active')->whereNotNull('customer_id')
            ->where('last_activity_at', '>', $from->copy()->subHours($delay))
            ->where('last_activity_at', '<=', $to->copy()->subHours($delay))
            ->whereHas('items')
            ->with('customer')->orderBy('id');
        foreach ($carts->lazyById(200) as $cart) {
            $customer = $cart->customer;
            if ($customer === null || ! filter_var($customer->email, FILTER_VALIDATE_EMAIL) || ! Consent::allows($customer, false)) {
                continue;
            }
            yield new Recipient($customer, $customer->email, (string) ($cart->locale ?? $customer->locale ?? Locales::default()), 'cart:'.$cart->id, ['cart_id' => $cart->id]);
        }
    }
}
