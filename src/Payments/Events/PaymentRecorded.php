<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;

class PaymentRecorded
{
    use Dispatchable;

    public function __construct(public Payment $payment, public PaymentResult $result) {}
}
