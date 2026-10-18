<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use Sunrice\Commerce\Payments\Models\Payment;

interface SupportsCancel
{
    public function cancel(Payment $payment): void;
}
