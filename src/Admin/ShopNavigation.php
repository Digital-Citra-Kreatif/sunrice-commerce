<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin;

use Sunrice\Commerce\Features\Features;
use Sunrice\Facades\Sunrice;

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
