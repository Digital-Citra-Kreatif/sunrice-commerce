<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Permissions;

use Sunrice\Facades\Sunrice;

/**
 * Every commerce permission (SPEC.md § Permission matrix), registered with
 * Sunrice so roles can be given them in Users → Roles. They are registered
 * whatever the modules' switches, so role grants survive a switch-off.
 */
final class CommercePermissions
{
    /** @return array<string, array{0: string, 1: string}> name => [label, group] */
    public static function all(): array
    {
        return [
            'commerce.dashboard.view' => ['View the store dashboard', 'Store'],

            'commerce.orders.view' => ['View orders and quotes', 'Store: Orders'],
            'commerce.orders.create' => ['Create manual orders', 'Store: Orders'],
            'commerce.orders.edit' => ['Edit orders and change their status', 'Store: Orders'],
            'commerce.orders.override-prices' => ['Change unit prices in manual and unpaid orders', 'Store: Orders'],
            'commerce.orders.cancel' => ['Cancel orders', 'Store: Orders'],
            'commerce.orders.refund' => ['Record refunds', 'Store: Orders'],
            'commerce.orders.delete' => ['Trash orders', 'Store: Orders'],
            'commerce.orders.export' => ['Export orders', 'Store: Orders'],
            'commerce.quotes.respond' => ['Price and send quotes', 'Store: Orders'],
            'commerce.payments.verify' => ['Approve payment confirmations and mark orders paid', 'Store: Orders'],
            'commerce.shipments.manage' => ['Add shipments and tracking', 'Store: Orders'],
            'commerce.documents.view' => ['Download invoices, packing slips and quotations', 'Store: Orders'],

            'commerce.customers.view' => ['View customers', 'Store: Customers'],
            'commerce.customers.edit' => ['Edit customers', 'Store: Customers'],
            'commerce.customers.delete' => ['Anonymize customers', 'Store: Customers'],
            'commerce.customers.export' => ['Export customers', 'Store: Customers'],

            'commerce.marketing.manage' => ['Send marketing emails and manage automations', 'Store: Marketing'],

            'commerce.inventory.view' => ['View stock levels', 'Store: Catalog'],
            'commerce.inventory.adjust' => ['Adjust stock', 'Store: Catalog'],

            'commerce.vouchers.manage' => ['Manage vouchers and automatic discounts', 'Store: Promotions'],
            'commerce.flash-sales.manage' => ['Manage flash sales', 'Store: Promotions'],
            'commerce.pricing-rules.manage' => ['Manage pricing rules', 'Store: Promotions'],

            'commerce.reports.view' => ['View reports', 'Store: Reports'],
            'commerce.reports.export' => ['Export reports', 'Store: Reports'],

            'commerce.settings.general' => ['Edit store settings: General', 'Store: Settings'],
            'commerce.settings.features' => ['Switch store features on and off', 'Store: Settings'],
            'commerce.settings.catalog' => ['Edit store settings: Catalog', 'Store: Settings'],
            'commerce.settings.checkout' => ['Edit store settings: Checkout', 'Store: Settings'],
            'commerce.settings.payments' => ['Edit store settings: Payments', 'Store: Settings'],
            'commerce.settings.shipping' => ['Edit store settings: Shipping', 'Store: Settings'],
            'commerce.settings.taxes' => ['Edit store settings: Taxes', 'Store: Settings'],
            'commerce.settings.accounts' => ['Edit store settings: Accounts', 'Store: Settings'],
            'commerce.settings.emails' => ['Edit store settings: Emails', 'Store: Settings'],
            'commerce.settings.documents' => ['Edit store settings: Documents', 'Store: Settings'],
        ];
    }

    public static function register(): void
    {
        foreach (self::all() as $name => [$label, $group]) {
            Sunrice::registerPermission($name, $label, $group);
        }
    }

    /**
     * Any commerce settings permission (who may open Settings → Store).
     *
     * @return list<string>
     */
    public static function settings(): array
    {
        return array_values(array_filter(array_keys(self::all()), fn (string $n) => str_starts_with($n, 'commerce.settings.')));
    }
}
