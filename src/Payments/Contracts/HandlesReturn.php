<?php

declare(strict_types=1);

namespace Sunrice\Commerce\Payments\Contracts;

use Illuminate\Http\Request;
use Sunrice\Commerce\Payments\Models\Payment;
use Sunrice\Commerce\Payments\PaymentResult;

/** The customer comes back from the gateway (GET order/{key}/payment/return). */
interface HandlesReturn
{
    public function handleReturn(Request $request, Payment $payment): PaymentResult;
}
