<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Checkout;

use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Settings\StoreSettings;

/** What the checkout asks for in the store's selling mode. */
class CheckoutMode
{
    public function __construct(protected StoreSettings $settings, protected Features $features) {}

    public function mode(): string
    {
        return (string) $this->settings->get('general.selling_mode', 'shop');
    }

    /** The completion strategy key: order, quote or whatsapp. */
    public function completion(): string
    {
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
