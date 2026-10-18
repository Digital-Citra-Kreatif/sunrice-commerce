<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Illuminate\Database\Eloquent\Builder;
use Sunrice\Commerce\Customers\Models\Customer;

/** N days after an order: a thank-you, a question, a request for a review. One email per order. */
class AfterOrder extends CustomerTrigger
{
    public function key(): string
    {
        return 'after_order';
    }

    public function label(): string
    {
        return 'After an order';
    }

    public function description(): string
    {
        return 'Follow up a few days after someone orders.';
    }

    public function delay(): array
    {
        return ['unit' => 'days', 'label' => 'Days after the order', 'default' => 7];
    }

    public function template(): string
    {
        return 'after_order';
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
        return 'after_order:'.$customer->last_order_at?->getTimestamp();
    }
}
