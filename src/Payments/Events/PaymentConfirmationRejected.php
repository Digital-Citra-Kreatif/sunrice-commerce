<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Payments\Models\PaymentConfirmation;

class PaymentConfirmationRejected
{
    use Dispatchable;

    public function __construct(public PaymentConfirmation $confirmation) {}
}
