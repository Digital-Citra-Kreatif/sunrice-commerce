<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers;

use Illuminate\Support\Facades\Route;
use Sunrice\Commerce\Storefront\StorefrontRoutes;

/**
 * My Account's menu: commerce's pages and those extensions register
 * (Commerce::registerAccountPage()).
 */
class AccountNavigation
{
    /** @var array<string, array{key: string, label: string|\Closure(): string, route: string, feature: string|\Closure(): bool|null, position: int}> */
    protected array $pages = [];

    /**
     * @param  string|\Closure(): string  $label
     * @param  string|\Closure(): bool|null  $feature  a module key, or a check
     */
    public function register(string $key, string|\Closure $label, string $route, string|\Closure|null $feature = null, int $position = 100): void
    {
        $this->pages[$key] = ['key' => $key, 'label' => $label, 'route' => $route, 'feature' => $feature, 'position' => $position];
    }

    /** @return array<int, array{key: string, label: string, url: string, route: string}> */
    public function items(): array
    {
        $pages = array_filter($this->pages, fn (array $p) => ($p['feature'] === null || ($p['feature'] instanceof \Closure ? ($p['feature'])() : commerce_feature($p['feature']))) && Route::has($p['route']));
        usort($pages, fn ($a, $b) => $a['position'] <=> $b['position']);

        return array_map(fn (array $p) => [
            'key' => $p['key'],
            'label' => $p['label'] instanceof \Closure ? ($p['label'])() : $p['label'],
            'url' => StorefrontRoutes::url($p['route']),
            'route' => $p['route'],
        ], $pages);
    }
}
