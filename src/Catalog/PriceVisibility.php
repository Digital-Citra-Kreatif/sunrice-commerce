<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Catalog;

use Sunrice\Commerce\Settings\StoreSettings;

/**
 * Who may see prices (Settings → Store → Catalog → Who sees prices):
 * everyone, signed-in customers, customers with chosen roles, or nobody.
 * When hidden, nothing may reveal a price (pages, JSON-LD, sorting,
 * filters, the compare page, JSON endpoints).
 */
class PriceVisibility
{
    public function __construct(protected StoreSettings $settings) {}

    public function visibleTo(mixed $customer): bool
    {
        return match ((string) $this->settings->get('catalog.price_visibility', 'everyone')) {
            'signed_in' => $customer !== null,
            'roles' => $customer !== null && method_exists($customer, 'hasAnyRole')
                && $customer->hasAnyRole((array) $this->settings->get('catalog.price_visibility_roles', [])),
            'nobody' => false,
            default => true,
        };
    }

    /** For the current storefront visitor. */
    public function visible(): bool
    {
        return $this->visibleTo(commerce_customer());
    }

    /** Hidden until signing in (rather than for good): "Sign in to see prices". */
    public function signInReveals(): bool
    {
        return commerce_customer() === null && in_array($this->settings->get('catalog.price_visibility'), ['signed_in', 'roles'], true);
    }
}
