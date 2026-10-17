<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Sunrice\Commerce\Features\Features;
use Sunrice\Facades\Sunrice;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;

/**
 * The admin sidebar's Shop group. Each item shows only while its module
 * is active and the user has its permission; the group sits right after
 * Content.
 */
final class ShopNavigation
{
    public const GROUP = 'Shop';

    /** Add a Shop item (admin path relative to the admin, e.g. "commerce/orders"). */
    public static function add(string $label, string $href, string $icon, string $permission, ?string $feature = null): void
    {
        Sunrice::addNavigationItem($label, $href, $icon, self::GROUP, function (mixed $user) use ($permission, $feature): bool {
            return ($feature === null || app(Features::class)->active($feature)) && $user->can($permission);
        });
    }

    public static function register(): void
    {
        self::add('Dashboard', 'commerce', 'shopping-bag', 'commerce.dashboard.view');
        self::add('Orders', 'commerce/orders', 'shopping-cart', 'commerce.orders.view', 'orders');
        self::add('Payments to verify', 'commerce/confirmations', 'credit-card', 'commerce.payments.verify', 'manual_payments');
        Sunrice::addNavigationItem('Products', 'commerce/products', 'package', self::GROUP, fn (mixed $user): bool => Collection::query()
            ->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->pluck('id')
            ->contains(fn (int $id) => $user->can('viewAny', [Entry::class, $id])));
        self::add('Customers', 'commerce/customers', 'users', 'commerce.customers.view');
        self::add('Vouchers', 'commerce/vouchers', 'credit-card', 'commerce.vouchers.manage', 'vouchers');
        self::add('Flash sales', 'commerce/flash-sales', 'megaphone', 'commerce.flash-sales.manage', 'flash_sales');
        self::add('Pricing rules', 'commerce/pricing-rules', 'chart-column', 'commerce.pricing-rules.manage', 'pricing_rules');
        self::add('Inventory', 'commerce/inventory', 'clipboard-list', 'commerce.inventory.view', 'inventory');

        Sunrice::navigationUsing(function (array $groups): array {
            $labels = array_column($groups, 'label');
            $shop = array_search(self::GROUP, $labels, true);
            if ($shop === false) {
                return $groups;
            }
            [$group] = array_splice($groups, (int) $shop, 1);
            $content = array_search('Content', array_column($groups, 'label'), true);
            array_splice($groups, $content === false ? 0 : (int) $content + 1, 0, [$group]);

            return $groups;
        });
    }
}
