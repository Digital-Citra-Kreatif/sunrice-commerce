<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Customers\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Customers\Models\Customer;

class AccountDeletionRequested
{
    use Dispatchable;

    public function __construct(public readonly Customer $customer) {}
}
