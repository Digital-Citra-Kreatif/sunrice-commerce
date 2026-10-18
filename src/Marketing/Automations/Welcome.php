<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

/** N hours after someone becomes a customer (registers, or orders as a guest). */
class Welcome extends CustomerTrigger
{
    public function key(): string
    {
        return 'welcome';
    }

    public function label(): string
    {
        return 'Welcome';
    }

    public function description(): string
    {
        return 'New customers, a little while after they join.';
    }

    public function delay(): array
    {
        return ['unit' => 'hours', 'label' => 'Hours after joining', 'default' => 1];
    }

    public function template(): string
    {
        return 'welcome';
    }

    protected function column(): string
    {
        return 'created_at';
    }
}
