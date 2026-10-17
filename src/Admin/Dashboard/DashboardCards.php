<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Dashboard;

use Closure;
use Sunrice\Commerce\Analytics\Period;

/**
 * Figures (KPIs) and to-dos on the store dashboard, provided by the
 * modules (orders to process, confirmations waiting, low stock…).
 */
class DashboardCards
{
    /** @var array<string, Closure(mixed, Period): ?array<string, mixed>> */
    protected array $kpis = [];

    /** @var array<string, Closure(mixed): ?array<string, mixed>> */
    protected array $todo = [];

    /** @var array<string, array{props: Closure(mixed, Period): array<string, mixed>, can: string|null, feature: string|null}> */
    protected array $widgets = [];

    /**
     * A widget: a React component registered in the admin bundle with
     * window.SunriceCommerce.registerDashboardWidget(name, Component),
     * rendered with these props (computed after the page shows) for users
     * with the permission while the module is on.
     *
     * @param  Closure(mixed, Period): array<string, mixed>  $props
     */
    public function widget(string $name, Closure $props, ?string $can = null, ?string $feature = null): void
    {
        $this->widgets[$name] = ['props' => $props, 'can' => $can, 'feature' => $feature];
    }

    /** @return array<string, array<string, mixed>> name => props, for the widgets this user may see */
    public function widgets(mixed $user, ?Period $period = null): array
    {
        $out = [];
        foreach ($this->widgets as $name => $widget) {
            if (($widget['feature'] === null || commerce_feature($widget['feature'])) && ($widget['can'] === null || $user->can($widget['can']))) {
                $out[$name] = ($widget['props'])($user, $period ?? Period::preset('7d'));
            }
        }

        return $out;
    }

    /**
     * A figure: the closure gets the user and the dashboard's Period and
     * returns {label, value, hint?, href?, change?} or null to hide it.
     *
     * @param  Closure(mixed, Period): ?array<string, mixed>  $card
     */
    public function kpi(string $key, Closure $card): void
    {
        $this->kpis[$key] = $card;
    }

    /**
     * A to-do: the closure returns {label, count, href} or null (nothing to do or not allowed).
     *
     * @param  Closure(mixed): ?array<string, mixed>  $card
     */
    public function addTodo(string $key, Closure $card): void
    {
        $this->todo[$key] = $card;
    }

    /** @return array<int, array<string, mixed>> */
    public function kpis(mixed $user, ?Period $period = null): array
    {
        return $this->resolve($this->kpis, $user, $period ?? Period::preset('7d'));
    }

    /** @return array<int, array<string, mixed>> */
    public function todo(mixed $user): array
    {
        return array_values(array_filter($this->resolve($this->todo, $user), fn (array $t) => ($t['count'] ?? 1) > 0));
    }

    /**
     * @param  array<string, Closure(mixed): ?array<string, mixed>>|array<string, Closure(mixed, Period): ?array<string, mixed>>  $cards
     * @return array<int, array<string, mixed>>
     */
    protected function resolve(array $cards, mixed $user, ?Period $period = null): array
    {
        $out = [];
        foreach ($cards as $key => $card) {
            $value = $card($user, $period);
            if ($value !== null) {
                $out[] = ['key' => $key, ...$value];
            }
        }

        return $out;
    }
}
