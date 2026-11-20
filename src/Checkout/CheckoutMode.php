<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;

/**
 * What the checkout asks for in the store's selling mode. In Online store
 * mode the store can also let customers send the cart as a quote request
 * (checkout.quote_requests: off | everyone | roles, with
 * checkout.quote_request_roles); requestQuote() switches this checkout to it.
 * One instance per request (scoped), so the controller, validator and
 * PlaceOrder see the same choice.
 */
class CheckoutMode
{
    protected bool $quoteRequested = false;

    public function __construct(protected StoreSettings $settings, protected Features $features) {}

    /** Whether this customer may send the cart as a quote request instead of ordering (Online store mode). */
    public function quoteOffered(): bool
    {
        if ($this->mode() !== 'shop' || ! $this->features->active('orders')) {
            return false;
        }

        return match ((string) $this->settings->get('checkout.quote_requests', 'off')) {
            'everyone' => true,
            'roles' => $this->customerHasRole((array) $this->settings->get('checkout.quote_request_roles', [])),
            default => false,
        };
    }

    /** Quote requests can come from checkout at all (Quotation mode, or offered alongside orders). */
    public function quotesPossible(): bool
    {
        return $this->mode() === 'quote' || ($this->mode() === 'shop' && (string) $this->settings->get('checkout.quote_requests', 'off') !== 'off');
    }

    /** This checkout becomes a quote request, when offered; false when it isn't. */
    public function requestQuote(): bool
    {
        return $this->quoteRequested = $this->quoteOffered();
    }

    public function quoteRequested(): bool
    {
        return $this->quoteRequested;
    }

    /** @param  array<int, mixed>  $roles */
    protected function customerHasRole(array $roles): bool
    {
        $user = commerce_customer();
        $roles = array_values(array_filter(array_map('strval', $roles)));

        return $user !== null && $roles !== [] && method_exists($user, 'hasAnyRole') && $user->hasAnyRole($roles);
    }

    public function mode(): string
    {
        return (string) $this->settings->get('general.selling_mode', 'shop');
    }

    /** The completion strategy key: order, quote or whatsapp. */
    public function completion(): string
    {
        if ($this->quoteRequested) {
            return 'quote';
        }

        return match ($this->mode()) {
            'quote' => 'quote',
            'whatsapp' => 'whatsapp',
            default => 'order',
        };
    }

    public function shipping(): bool
    {
        return $this->features->active('shipping');
    }

    /** A rate must be chosen (quotes can leave shipping to the store). */
    public function requiresRate(): bool
    {
        return $this->shipping() && $this->completion() !== 'quote';
    }

    /** Payment is chosen at checkout (Online store mode). */
    public function payment(): bool
    {
        return $this->completion() === 'order';
    }
}
