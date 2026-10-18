<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Orders;

use Closure;
use Sunrice\Commerce\Orders\Models\Order;

/**
 * Extra panels on the admin order page (Commerce::registerOrderPanel()):
 * the PHP side gives each panel its data; the admin bundle of the package
 * renders it with SunriceCommerce.registerOrderPanel(key, Component).
 */
class OrderPanels
{
    /** @var array<string, array{label: string, data: (Closure(Order): array<string, mixed>)|null, permission: string|null, position: int}> */
    protected array $panels = [];

    /** @param  (Closure(Order): array<string, mixed>)|null  $data */
    public function register(string $key, string $label, ?Closure $data = null, ?string $permission = null, int $position = 100): void
    {
        $this->panels[$key] = ['label' => $label, 'data' => $data, 'permission' => $permission, 'position' => $position];
    }

    /** @return array<int, array{key: string, label: string, data: array<string, mixed>}> */
    public function for(Order $order, mixed $user): array
    {
        $panels = array_filter($this->panels, fn (array $p) => $p['permission'] === null || $user->can($p['permission']));
        uasort($panels, fn ($a, $b) => $a['position'] <=> $b['position']);
        $out = [];
        foreach ($panels as $key => $panel) {
            $out[] = ['key' => $key, 'label' => $panel['label'], 'data' => $panel['data'] !== null ? ($panel['data'])($order) : []];
        }

        return $out;
    }
}
