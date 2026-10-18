<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Storefront;

use Sunrice\Commerce\Features\Features;

/**
 * Places in the store templates where packages add their own partials
 * (<x-commerce::slot name="checkout.before_submit" />).
 */
class Slots
{
    /** @var array<string, array<int, array{view: string, feature: ?string}>> */
    protected array $slots = [];

    public function register(string $slot, string $view, ?string $feature = null): void
    {
        $this->slots[$slot][] = ['view' => $view, 'feature' => $feature];
    }

    /** @return array<int, string> views to render, for active modules */
    public function views(string $slot): array
    {
        $features = app(Features::class);

        return array_values(array_map(
            fn (array $entry) => $entry['view'],
            array_filter($this->slots[$slot] ?? [], fn (array $entry) => $entry['feature'] === null || $features->active($entry['feature'])),
        ));
    }
}
