<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Illuminate\Database\Eloquent\Builder;

/** N days after registering, for customers who still haven't ordered. */
class FirstOrderNudge extends CustomerTrigger
{
    public function key(): string
    {
        return 'first_order';
    }

    public function label(): string
    {
        return 'No first order yet';
    }

    public function description(): string
    {
        return 'Registered customers who haven\'t ordered yet.';
    }

    public function delay(): array
    {
        return ['unit' => 'days', 'label' => 'Days after registering', 'default' => 7];
    }

    public function template(): string
    {
        return 'first_order';
    }

    protected function column(): string
    {
        return 'created_at';
    }

    protected function narrow(Builder $query): void
    {
        $query->where('orders_count', 0)->whereNotNull('user_id');
    }
}
