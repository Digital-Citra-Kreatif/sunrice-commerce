<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use ReflectionMethod;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Http\Controllers\Admin\SettingsController;
use Sunrice\Commerce\Settings\StoreSettings;
use Sunrice\Facades\Sunrice;
use Sunrice\Models\Collection;
use Sunrice\Models\Entry;

/**
 * The admin sidebar's Shop group: everything the store needs, products,
 * their categories, brands and tags, and the store settings included.
 * Related pages share a submenu (Orders, Products, Promotions, Marketing)
 * on Sunrice versions with submenus. Each item shows only while its
 * module is active and the user has its permission; the group sits right
 * after Content.
 */
final class ShopNavigation
{
    public const GROUP = 'Shop';

    /**
     * Add a Shop item (admin path relative to the admin, e.g. "commerce/orders"),
     * optionally in the submenu of the item labelled $parent.
     */
    public static function add(string $label, string $href, string $icon, string $permission, ?string $feature = null, ?string $parent = null): void
    {
        $can = function (mixed $user) use ($permission, $feature): bool {
            return ($feature === null || app(Features::class)->active($feature)) && $user->can($permission);
        };
        if ($parent !== null && self::nests()) {
            Sunrice::addNavigationItem($label, $href, $icon, self::GROUP, $can, parent: $parent);
        } else {
            Sunrice::addNavigationItem($label, $href, $icon, self::GROUP, $can);
        }
    }

    /** Whether Sunrice's sidebar has submenus (addNavigationItem's `parent`). */
    public static function nests(): bool
    {
        return collect((new ReflectionMethod(\Sunrice\Sunrice::class, 'addNavigationItem'))->getParameters())->contains(fn ($p) => $p->getName() === 'parent');
    }

    /**
     * Everything the store needs in one group: the product collections leave
     * Content (Shop → Products lists them), the product taxonomies leave
     * Taxonomies and follow Products, and Store settings closes the group,
     * which sits right after Content.
     *
     * @param  array<int, array{label: string, items: array<int, array<string, mixed>>}>  $groups
     * @return array<int, array{label: string, items: array<int, array<string, mixed>>}>
     */
    public static function arrange(array $groups, mixed $user): array
    {
        $shop = array_search(self::GROUP, array_column($groups, 'label'), true);
        if ($shop === false) {
            return $groups;
        }
        $collections = array_map(fn (string $h) => "collections/{$h}/entries", (array) config('commerce.catalog.collections', ['products']));
        $taxonomies = array_map(fn (string $h) => "taxonomies/{$h}/terms", array_values(array_filter([
            config('commerce.catalog.category_taxonomy'), config('commerce.catalog.brand_taxonomy'), config('commerce.catalog.tag_taxonomy'),
            ...(array) app(StoreSettings::class)->get('catalog.attribute_taxonomies', []),
        ])));

        $moved = [];
        foreach ($groups as $i => $group) {
            if ($i === $shop) {
                continue;
            }
            $groups[$i]['items'] = array_values(array_filter($group['items'], function (array $item) use ($collections, $taxonomies, &$moved): bool {
                if (in_array($item['href'] ?? null, $taxonomies, true)) {
                    $moved[array_search($item['href'], $taxonomies, true)] = $item;

                    return false;
                }

                return ! in_array($item['href'] ?? null, $collections, true);
            }));
        }
        ksort($moved);

        $items = $groups[$shop]['items'];
        $products = array_search('commerce/products', array_column($items, 'href'), true);
        if ($products !== false && self::nests()) {
            // Products ▸ All products, the product taxonomies, Inventory…
            $own = $items[$products]['items'] ?? [array_diff_key($items[$products], ['items' => true])];
            array_splice($own, 1, 0, array_values($moved));
            $items[$products]['items'] = $own;
        } else {
            array_splice($items, $products === false ? count($items) : (int) $products + 1, 0, array_values($moved));
        }
        // A submenu's own page is its first link: "All orders", "All products".
        foreach ($items as $i => $item) {
            if (count($item['items'] ?? []) > 1 && ($item['items'][0]['href'] ?? null) === $item['href'] && $item['items'][0]['label'] === $item['label']) {
                $items[$i]['items'][0]['label'] = 'All '.mb_strtolower($item['label']);
            }
        }
        if ($user !== null && SettingsController::menu($user) !== []) {
            $items[] = ['label' => 'Store settings', 'href' => 'commerce/settings', 'icon' => 'settings'];
        }
        $groups[$shop]['items'] = $items;

        // Shop right after Content; groups left empty go.
        [$group] = array_splice($groups, (int) $shop, 1);
        $groups = array_values(array_filter($groups, fn (array $g) => $g['items'] !== []));
        $content = array_search('Content', array_column($groups, 'label'), true);
        array_splice($groups, $content === false ? 0 : (int) $content + 1, 0, [$group]);

        return $groups;
    }

    public static function register(): void
    {
        self::add('Dashboard', 'commerce', 'shopping-bag', 'commerce.dashboard.view');
        self::add('Orders', 'commerce/orders', 'shopping-cart', 'commerce.orders.view', 'orders');
        self::add('Payments to verify', 'commerce/confirmations', 'credit-card', 'commerce.payments.verify', 'manual_payments', parent: 'Orders');
        Sunrice::addNavigationItem('Products', 'commerce/products', 'package', self::GROUP, fn (mixed $user): bool => Collection::query()
            ->whereIn('handle', (array) config('commerce.catalog.collections', ['products']))->pluck('id')
            ->contains(fn (int $id) => $user->can('viewAny', [Entry::class, $id])));
        self::add('Inventory', 'commerce/inventory', 'clipboard-list', 'commerce.inventory.view', 'inventory', parent: 'Products');
        self::add('Customers', 'commerce/customers', 'users', 'commerce.customers.view');
        self::add('Vouchers', 'commerce/vouchers', 'megaphone', 'commerce.vouchers.manage', 'vouchers', parent: 'Promotions');
        self::add('Flash sales', 'commerce/flash-sales', 'megaphone', 'commerce.flash-sales.manage', 'flash_sales', parent: 'Promotions');
        self::add('Pricing rules', 'commerce/pricing-rules', 'megaphone', 'commerce.pricing-rules.manage', 'pricing_rules', parent: 'Promotions');
        self::add('Campaigns', 'commerce/marketing/campaigns', 'mail', 'commerce.marketing.manage', 'marketing', parent: 'Marketing');
        self::add('Automations', 'commerce/marketing/automations', 'mail', 'commerce.marketing.manage', 'marketing', parent: 'Marketing');
        self::add('Reports', 'commerce/reports', 'chart-column', 'commerce.reports.view', 'analytics');

        Sunrice::navigationUsing(fn (array $groups, mixed $user): array => self::arrange($groups, $user));
    }
}
