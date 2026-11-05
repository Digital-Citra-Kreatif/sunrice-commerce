<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Sunrice\Admin\Navigation\NavigationItem;
use Sunrice\Cms\Support\Access;
use Sunrice\Commerce\Features\Features;

/**
 * The admin sidebar's Shop group: the store dashboard, orders, products,
 * customers, promotions, marketing and reports. Related pages share a
 * submenu (Orders, Products, Promotions, Marketing). Each item shows only
 * while its module is active and the user has its permission.
 */
final class ShopNavigation
{
    public const GROUP = 'Shop';

    /** Shop items sit between Content (10–55) and Structure (90+). */
    public const SORT = 70;

    /**
     * A Shop item: a page under the admin path ("commerce/orders"), shown
     * to users with the permission while the module is active; with
     * `$parent`, in that item's submenu.
     */
    public static function item(string $key, string $label, string $url, string $icon, string $permission, ?string $feature = null, ?string $parent = null, int $sort = 0): NavigationItem
    {
        return NavigationItem::make("commerce-{$key}")->label($label)->url($url)->icon($icon)->group(self::GROUP)
            ->parent($parent === null ? null : "commerce-{$parent}")->sort(self::SORT + $sort)
            ->visible(fn (Authorizable $user): bool => ($feature === null || app(Features::class)->active($feature)) && $user->can($permission));
    }

    /** @return list<NavigationItem> */
    public static function items(): array
    {
        return [
            self::item('dashboard', 'Dashboard', 'commerce', 'shopping-bag', 'commerce.dashboard.view'),
            self::item('orders', 'Orders', 'commerce/orders', 'shopping-cart', 'commerce.orders.view', 'orders', sort: 1),
            self::item('confirmations', 'Payments to verify', 'commerce/confirmations', 'credit-card', 'commerce.payments.verify', 'manual_payments', 'orders'),
            NavigationItem::make('commerce-products')->label('Products')->url('commerce/products')->icon('package')->group(self::GROUP)->sort(self::SORT + 2)
                ->visible(fn (Authorizable $user): bool => collect((array) config('commerce.catalog.collections', ['products']))
                    ->contains(fn (mixed $handle): bool => is_string($handle) && Access::entries($user, 'view', $handle))),
            self::item('inventory', 'Inventory', 'commerce/inventory', 'clipboard-list', 'commerce.inventory.view', 'inventory', 'products'),
            self::item('customers', 'Customers', 'commerce/customers', 'users', 'commerce.customers.view', sort: 3),
            self::item('vouchers', 'Vouchers', 'commerce/vouchers', 'megaphone', 'commerce.vouchers.manage', 'vouchers', sort: 4),
            self::item('flash-sales', 'Flash sales', 'commerce/flash-sales', 'megaphone', 'commerce.flash-sales.manage', 'flash_sales', 'vouchers'),
            self::item('pricing-rules', 'Pricing rules', 'commerce/pricing-rules', 'megaphone', 'commerce.pricing-rules.manage', 'pricing_rules', 'vouchers'),
            self::item('campaigns', 'Campaigns', 'commerce/marketing/campaigns', 'mail', 'commerce.marketing.manage', 'marketing', sort: 5),
            self::item('automations', 'Automations', 'commerce/marketing/automations', 'mail', 'commerce.marketing.manage', 'marketing', 'campaigns'),
            self::item('reports', 'Reports', 'commerce/reports', 'chart-column', 'commerce.reports.view', 'analytics', sort: 6),
        ];
    }
}
