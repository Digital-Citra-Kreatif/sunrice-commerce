<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing;

use Sunrice\Commerce\Customers\Models\Customer;

/**
 * Whether someone may get marketing email: a customer who accepts it (and
 * isn't anonymized or leaving), or someone who just ticked "send me news"
 * at checkout and never unsubscribed.
 */
final class Consent
{
    public static function allows(?Customer $customer, bool $tickedNow = false): bool
    {
        if ($customer !== null && ($customer->anonymized_at !== null || $customer->deletion_requested_at !== null)) {
            return false;
        }
        if ($customer?->accepts_marketing) {
            return true;
        }

        return $tickedNow && ($customer === null || empty(($customer->meta ?? [])['marketing_unsubscribed_at']));
    }

    /** Stop marketing email to an address (creating a customer record to remember it for a guest). */
    public static function withdraw(?Customer $customer, string $email): Customer
    {
        $customer ??= Customer::query()->firstOrCreate(['email' => mb_strtolower($email)]);
        $customer->forceFill([
            'accepts_marketing' => false,
            'marketing_consent_at' => null,
            'meta' => [...(array) $customer->meta, 'marketing_unsubscribed_at' => now()->toIso8601String()],
        ])->save();

        return $customer;
    }
}
