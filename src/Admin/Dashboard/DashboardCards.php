<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Admin\Dashboard;

use Closure;

/**
 * Figures (KPIs) and to-dos on the store dashboard, provided by the
 * modules (orders to process, confirmations waiting, low stock…).
 */
class DashboardCards
{
    /** @var array<string, Closure(mixed): ?array<string, mixed>> */
    protected array $kpis = [];

    /** @var array<string, Closure(mixed): ?array<string, mixed>> */
    protected array $todo = [];

    /**
     * A figure: the closure gets the user and returns {label, value, hint?, href?} or null to hide it.
     *
     * @param  Closure(mixed): ?array<string, mixed>  $card
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
    public function kpis(mixed $user): array
    {
        return $this->resolve($this->kpis, $user);
    }

    /** @return array<int, array<string, mixed>> */
    public function todo(mixed $user): array
    {
        return array_values(array_filter($this->resolve($this->todo, $user), fn (array $t) => ($t['count'] ?? 1) > 0));
    }

    /**
     * @param  array<string, Closure(mixed): ?array<string, mixed>>  $cards
     * @return array<int, array<string, mixed>>
     */
    protected function resolve(array $cards, mixed $user): array
    {
        $out = [];
        foreach ($cards as $key => $card) {
            $value = $card($user);
            if ($value !== null) {
                $out[] = ['key' => $key, ...$value];
            }
        }

        return $out;
    }
}
