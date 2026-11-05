<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Http\RedirectResponse;
use Sunrice\Admin\Navigation\NavigationItem;
use Sunrice\Admin\Panel;
use Sunrice\Cms\Support\Access;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Http\Controllers\Admin\SettingsController;

/**
 * The admin sidebar's Shop group: everything the store needs in one place.
 * Related pages share a submenu: Orders (payments to verify), Products
 * (the product taxonomies, which the CMS also lists under Taxonomies, and
 * inventory), Promotions and Marketing. Each item shows only while its
 * module is active and the user may open it; a submenu's parent shows
 * when one of its pages does.
 */
final class ShopNavigation
{
    public const GROUP = 'Shop';

    /** Shop items sit between Content (10–55) and Structure (90+). */
    public const SORT = 70;

    /** The promotions pages, in the order Promotions opens the first the user may see. */
    public const PROMOTIONS = [
        ['vouchers', 'Vouchers', 'commerce/vouchers', 'commerce.vouchers.manage', 'vouchers'],
        ['flash-sales', 'Flash sales', 'commerce/flash-sales', 'commerce.flash-sales.manage', 'flash_sales'],
        ['pricing-rules', 'Pricing rules', 'commerce/pricing-rules', 'commerce.pricing-rules.manage', 'pricing_rules'],
    ];

    /**
     * A Shop item: a page under the admin path ("commerce/orders"), shown
     * to users with the permission while the module is active; with
     * `$parent`, in that item's submenu.
     */
    public static function item(string $key, string $label, string $url, string $icon, string $permission, ?string $feature = null, ?string $parent = null, int $sort = 0): NavigationItem
    {
        return NavigationItem::make("commerce-{$key}")->label($label)->url($url)->icon($icon)->group(self::GROUP)
            ->parent($parent === null ? null : "commerce-{$parent}")->sort(self::SORT + $sort)
            ->visible(fn (Authorizable $user): bool => self::allows($user, $permission, $feature));
    }

    public static function allows(Authorizable $user, string $permission, ?string $feature = null): bool
    {
        return ($feature === null || app(Features::class)->active($feature)) && $user->can($permission);
    }

    /** @return list<NavigationItem> */
    public static function items(): array
    {
        $promotions = fn (Authorizable $user): bool => self::firstPromotion($user) !== null;

        return [
            self::item('dashboard', 'Dashboard', 'commerce', 'shopping-bag', 'commerce.dashboard.view'),
            self::item('orders', 'Orders', 'commerce/orders', 'shopping-cart', 'commerce.orders.view', 'orders', sort: 1),
            self::item('confirmations', 'Payments to verify', 'commerce/confirmations', 'credit-card', 'commerce.payments.verify', 'manual_payments', 'orders'),
            NavigationItem::make('commerce-products')->label('Products')->url('commerce/products')->icon('package')->group(self::GROUP)->sort(self::SORT + 2)
                ->visible(fn (Authorizable $user): bool => collect((array) config('commerce.catalog.collections', ['products']))
                    ->contains(fn (mixed $handle): bool => is_string($handle) && Access::entries($user, 'view', $handle))),
            ...self::taxonomyItems(),
            self::item('inventory', 'Inventory', 'commerce/inventory', 'clipboard-list', 'commerce.inventory.view', 'inventory', 'products', sort: 9),
            self::item('customers', 'Customers', 'commerce/customers', 'users', 'commerce.customers.view', sort: 3),
            NavigationItem::make('commerce-promotions')->label('Promotions')->url('commerce/promotions')->icon('megaphone')->group(self::GROUP)
                ->sort(self::SORT + 4)->visible($promotions),
            ...array_map(fn (array $p, int $i): NavigationItem => self::item($p[0], $p[1], $p[2], 'megaphone', $p[3], $p[4], 'promotions', $i), self::PROMOTIONS, array_keys(self::PROMOTIONS)),
            NavigationItem::make('commerce-marketing')->label('Marketing')->url('commerce/marketing/campaigns')->icon('mail')->group(self::GROUP)
                ->sort(self::SORT + 5)->visible(fn (Authorizable $user): bool => self::allows($user, 'commerce.marketing.manage', 'marketing')),
            self::item('campaigns', 'Campaigns', 'commerce/marketing/campaigns', 'mail', 'commerce.marketing.manage', 'marketing', 'marketing'),
            self::item('automations', 'Automations', 'commerce/marketing/automations', 'mail', 'commerce.marketing.manage', 'marketing', 'marketing', 1),
            self::item('reports', 'Reports', 'commerce/reports', 'chart-column', 'commerce.reports.view', 'analytics', sort: 6),
            NavigationItem::make('commerce-store-settings')->label('Store settings')->url('commerce/settings')->icon('settings')->group(self::GROUP)
                ->sort(self::SORT + 8)->visible(fn (Authorizable $user): bool => SettingsController::menu($user) !== []),
        ];
    }

    /**
     * The product taxonomies (categories, brands, tags, attributes) in the
     * Products submenu, for users who may see their terms.
     *
     * @return list<NavigationItem>
     */
    public static function taxonomyItems(): array
    {
        $taxonomies = [
            'category_taxonomy' => ['Product categories', null],
            'brand_taxonomy' => ['Brands', 'brands'],
            'tag_taxonomy' => ['Product tags', null],
        ];
        $items = [];
        foreach ($taxonomies as $key => [$label, $feature]) {
            $handle = config("commerce.catalog.{$key}");
            if (is_string($handle) && $handle !== '') {
                $items[] = NavigationItem::make("commerce-taxonomy-{$handle}")->label($label)->url("cms/taxonomies/{$handle}/terms")->icon('tag')
                    ->group(self::GROUP)->parent('commerce-products')->sort(self::SORT + count($items) + 1)
                    ->visible(fn (Authorizable $user): bool => ($feature === null || app(Features::class)->active($feature)) && Access::terms($user, 'view', $handle));
            }
        }

        return $items;
    }

    /** The first promotions page the user may open, or null. */
    public static function firstPromotion(Authorizable $user): ?string
    {
        foreach (self::PROMOTIONS as [, , $url, $permission, $feature]) {
            if (self::allows($user, $permission, $feature)) {
                return $url;
            }
        }

        return null;
    }

    /** GET commerce/promotions: on to the first promotions page the user may open. */
    public static function promotions(): RedirectResponse
    {
        $user = request()->user();
        $url = $user instanceof Authorizable ? self::firstPromotion($user) : null;
        abort_if($url === null, 403);

        return redirect()->to(url(trim(app(Panel::class)->getPath(), '/').'/'.$url));
    }
}
