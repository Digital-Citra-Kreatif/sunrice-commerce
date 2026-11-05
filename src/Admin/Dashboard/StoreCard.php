<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Dashboard;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Sunrice\Commerce\Analytics\Day;
use Sunrice\Commerce\Analytics\Stats;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Support\MoneyFormatter;

/**
 * The Store tile on the panel's dashboard (CommercePlugin's widget):
 * today's sales and orders, and the store's to-dos, for users who may see
 * the store dashboard.
 */
final class StoreCard
{
    public static function visible(?Authorizable $user): bool
    {
        return $user !== null && $user->can('commerce.dashboard.view');
    }

    /**
     * Today's sales and orders, and the store's to-dos.
     *
     * @return array{todo: list<array<string, mixed>>, sales?: string, orders?: int}
     */
    public static function props(Authorizable $user): array
    {
        $props = ['todo' => array_values(app(DashboardCards::class)->todo($user))];
        if (app(Features::class)->active('analytics')) {
            $today = app(Stats::class)->totals(Day::of(now()), Day::of(now()));
            $props['sales'] = app(MoneyFormatter::class)->format($today['total_sales']);
            $props['orders'] = $today['orders'];
        }

        return $props;
    }

    /**
     * The widget's data: a stat of today's sales (or the to-dos' count
     * without analytics), described by today's orders and the to-dos.
     *
     * @return array{value: string|int, description?: string}
     */
    public static function data(Authorizable $user): array
    {
        $props = self::props($user);
        $todo = array_sum(array_map(fn (array $t): int => (int) ($t['count'] ?? 1), $props['todo']));
        $parts = array_filter([
            isset($props['orders']) ? trans_choice(':count order today|:count orders today', $props['orders']) : null,
            $todo > 0 ? trans_choice(':count to-do|:count to-dos', $todo) : null,
        ]);

        return ['value' => $props['sales'] ?? $todo, ...($parts === [] ? [] : ['description' => implode(' · ', $parts)])];
    }
}
