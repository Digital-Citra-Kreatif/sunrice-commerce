<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;

/** Asked once before an unpaid payment expires. */
interface SupportsStatusCheck
{
    public function check(Payment $payment): PaymentResult;
}
