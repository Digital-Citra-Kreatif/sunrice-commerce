<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Sunrice\Commerce\Admin\Dashboard\DashboardCards;
use Sunrice\Commerce\Admin\Setup\SetupChecklist;
use Sunrice\Commerce\Analytics\Period;
use Sunrice\Commerce\Analytics\Stats;
use Sunrice\Commerce\Features\Actions\ToggleFeature;
use Sunrice\Commerce\Features\Features;
use Sunrice\Commerce\Health\HealthRegistry;
use Sunrice\Commerce\Orders\Models\Order;
use Sunrice\Commerce\Orders\OrderStatus;
use Sunrice\Commerce\Support\MoneyFormatter;

/** Shop → Dashboard: the setup checklist, health, figures, chart, to-dos and recent orders. */
class DashboardController extends Controller
{
    public const PERIODS = ['today', '7d', '30d'];

    public function __invoke(Request $request, SetupChecklist $checklist, HealthRegistry $health, Features $features, DashboardCards $cards, Stats $stats): Response
    {
        $this->authorize('commerce.dashboard.view');
        $mode = $features->mode();
        $key = in_array($request->query('period'), self::PERIODS, true) ? (string) $request->query('period') : '7d';
        $period = Period::preset($key);
        $analytics = $features->active('analytics');
        $user = $request->user();

        return Inertia::render('Commerce/Dashboard', [
            'mode' => ['key' => $mode, 'label' => ToggleFeature::MODE_LABELS[$mode] ?? $mode],
            'setup' => $checklist->evaluate(),
            'health' => array_map(fn (string $key, array $outcome) => [
                'key' => $key,
                'label' => $outcome['label'],
                'status' => $outcome['result']->status,
                'message' => $outcome['result']->message,
                'fix' => $outcome['result']->fix,
            ], array_keys($results = $health->run()), $results),
            'period' => ['key' => $key, 'options' => array_map(fn (string $p) => ['value' => $p, 'label' => Period::PRESETS[$p]], self::PERIODS)],
            'analytics' => $analytics,
            'canReports' => $analytics && $user->can('commerce.reports.view'),
            // Figures and lists are computed after the page shows.
            'kpis' => Inertia::defer(fn () => [...($analytics ? $stats->kpis($period) : []), ...$cards->kpis($user, $period)], 'figures'),
            'sales' => Inertia::defer(fn () => $analytics ? $this->sales($stats, $period) : [], 'figures'),
            'topProducts' => Inertia::defer(fn () => $analytics ? $stats->topProducts($period->from, $period->to) : [], 'figures'),
            'todo' => Inertia::defer(fn () => $cards->todo($user), 'lists'),
            'widgets' => Inertia::defer(fn () => $cards->widgets($user, $period), 'lists'),
            'recentOrders' => Inertia::defer(fn () => $features->active('orders') && $user->can('commerce.orders.view') ? $this->recentOrders() : [], 'lists'),
        ]);
    }

    /** @return array<int, array{date: string, total: int, orders: int, previous: int|null}> */
    protected function sales(Stats $stats, Period $period): array
    {
        // Today is one point: show the last 7 days around it instead.
        $chart = $period->preset === 'today' ? Period::preset('7d') : $period;
        $now = array_values($stats->series($chart, ['total_sales', 'orders']));
        $before = ($previous = $chart->previous()) !== null ? array_values($stats->series($previous, ['total_sales'])) : [];
        $dates = $chart->buckets();

        return array_map(fn (int $i) => [
            'date' => $dates[$i], 'total' => $now[$i]['total_sales'], 'orders' => $now[$i]['orders'], 'previous' => $before[$i]['total_sales'] ?? null,
        ], array_keys($dates));
    }

    /** @return array<int, array<string, mixed>> */
    protected function recentOrders(): array
    {
        $money = app(MoneyFormatter::class);

        return Order::query()->where('type', 'order')->whereNotNull('placed_at')->latest('placed_at')->latest('id')->limit(5)
            ->get(['id', 'number', 'customer_name', 'email', 'status', 'payment_status', 'total', 'placed_at'])
            ->map(fn (Order $o) => [
                'id' => $o->id, 'number' => $o->displayNumber(), 'customer' => $o->customer_name ?: $o->email, 'total' => $money->format($o->total),
                'status' => OrderStatus::label($o->status), 'status_key' => $o->status, 'placed_at' => $o->placed_at?->toIso8601String(), 'href' => "commerce/orders/{$o->id}",
            ])->all();
    }
}
