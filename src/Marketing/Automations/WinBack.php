<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Illuminate\Database\Eloquent\Builder;
use Sunrice\Commerce\Customers\Models\Customer;

/** N days after a customer's last order, if they haven't ordered since. One email per last order. */
class WinBack extends CustomerTrigger
{
    public function key(): string
    {
        return 'win_back';
    }

    public function label(): string
    {
        return 'Win back';
    }

    public function description(): string
    {
        return 'Customers who haven\'t ordered for a while.';
    }

    public function delay(): array
    {
        return ['unit' => 'days', 'label' => 'Days since the last order', 'default' => 60];
    }

    public function template(): string
    {
        return 'win_back';
    }

    protected function column(): string
    {
        return 'last_order_at';
    }

    protected function narrow(Builder $query): void
    {
        $query->where('orders_count', '>', 0);
    }

    protected function dedupe(Customer $customer): string
    {
        return 'win_back:'.$customer->last_order_at?->getTimestamp();
    }
}
