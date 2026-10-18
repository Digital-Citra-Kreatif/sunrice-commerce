<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Dashboard;

use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Analytics\Stats;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Support\MoneyFormatter;
use Sunrice\Sunrice;

/**
 * The Store card on Sunrice's own dashboard (U2): today's sales and the
 * store's to-dos, for users who may see the store dashboard. Registered
 * only on Sunrice versions with dashboard cards.
 */
final class StoreCard
{
    public static function register(): void
    {
        // Sunrice::addDashboardCard() arrives with U2; until then there is no card to add.
        $add = [app(Sunrice::class), 'addDashboardCard'];
        if (is_callable($add)) {
            $add('commerce-store', fn () => self::props(request()->user()), fn (mixed $user): bool => self::visible($user), 10);
        }
    }

    public static function visible(mixed $user): bool
    {
        return $user !== null && $user->can('commerce.dashboard.view');
    }

    /** @return array<string, mixed> */
    public static function props(mixed $user): array
    {
        $props = ['todo' => app(DashboardCards::class)->todo($user)];
        if (app(Features::class)->active('analytics')) {
            $today = app(Stats::class)->totals(Day::of(now()), Day::of(now()));
            $props['sales'] = app(MoneyFormatter::class)->format($today['total_sales']);
            $props['orders'] = $today['orders'];
        }

        return $props;
    }
}
