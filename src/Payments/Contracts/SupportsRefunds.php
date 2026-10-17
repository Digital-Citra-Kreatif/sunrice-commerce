<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\RefundResult;

interface SupportsRefunds
{
    public function refund(Payment $payment, int $amount, string $reason): RefundResult;
}
