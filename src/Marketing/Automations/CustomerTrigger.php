<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Marketing\Automations;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Sunrice\Commerce\Customers\Models\Customer;
use Sunrice\Commerce\Marketing\Audience;
use Sunrice\Commerce\Marketing\Recipient;
use Sunrice\Support\Locales;

/** A trigger on a customer's own date (sign-up, last order), shifted by the delay. */
abstract class CustomerTrigger implements Trigger
{
    /** The date column the delay counts from. */
    abstract protected function column(): string;

    /**
     * Narrow the customers (e.g. only those who never ordered).
     *
     * @param  Builder<Customer>  $query
     */
    protected function narrow(Builder $query): void {}

    /** One email per… (e.g. per last order). */
    protected function dedupe(Customer $customer): string
    {
        return $this->key();
    }

    public function recipients(int $delay, CarbonInterface $from, CarbonInterface $to): iterable
    {
        $shift = fn (CarbonInterface $at) => $this->delay()['unit'] === 'hours' ? $at->copy()->subHours($delay) : $at->copy()->subDays($delay);
        $query = Audience::reachable()
            ->where('commerce_customers.'.$this->column(), '>', $shift($from))
            ->where('commerce_customers.'.$this->column(), '<=', $shift($to));
        $this->narrow($query);
        foreach ($query->lazyById(200, 'commerce_customers.id', 'id') as $customer) {
            yield new Recipient($customer, $customer->email, (string) ($customer->locale ?? Locales::main()), $this->dedupe($customer));
        }
    }
}
